var _               = require('lodash');
var Promise         = require('bluebird');
var io              = require('../socket.js');
var models          = require('../../models');
var calculateBadges = require('../../gamification/calculateBadges');
var POINTS          = require('../../../frontend/shared/gamification/points');
var BADGES          = require('../../../frontend/shared/gamification/badges');

var User = models.User;
var Action = models.Action;
var Vote = models.Vote;
var Item = models.Item;
var Badge = models.Badge;
var Booster = models.Booster;

module.exports = function (req, res) {

    // get params and body
    var body     = req.body;
    var username = body.username;
    var group    = body.group;
    var label    = body.label;
    var value    = JSON.stringify(body.value);

    // get or create user
    User.findOrCreate({
        where: {username: username}
    }).then(_.first).then(function(user) {

        var today = new Date();
        today.setHours(0, 0, 0, 0);

        Promise.all([
            // get the current booster
            user.getBoosters({
                where: {
                    validUntil: {
                        $gt: new Date()
                    }
                }
            }),
            // find todays auth action
            user.getActions({
                where: {
                    createdAt: {
                        $gt: today
                    },
                    group: 'auth',
                    label: 'login'
                }
            })
        ]).then(function (results) {

            var booster = results[0];
            var authAction = results[1];

            console.error(booster, authAction);

            var createActionAndAnswer = function (props) {
                return Action.create(actionProps).then(function (action) {
                    res.json(action);
                });
            };

            var points = _.get(POINTS, [group, label], 0);

            if (booster) {
                // there should always be only one Booster
                points = points * _.get(booster, '[0].multiplicator', 1);
            }

            // authentication is allowed once per day
            if (group === 'auth' && label === 'login' && authAction) {
                points = 0;
            }

            var actionProps = {
                group: group,
                label: label,
                value: value,
                points: points
            };

            var answer = function (badges, stats, action) {
                res.json({
                    badges: badges,
                    stats: stats,
                    action: action
                });

                io.emit('action_created', {
                    user: user,
                    action: action,
                    badges: badges
                });
            };

            // calculate the badges and if there are new ones, add them
            var calcBadges = function(action) {

                var badges = [];
                var stats = {};

                // recalculate the badges and points
                var result = calculateBadges(action, user);

                result.then(function (data) {

                    // check which one the user already has
                    if (data && data.badges && data.badges.length > 0) {

                        badges = data.badges;
                        stats  = data.stats;

                        user.getBadges().then(function(result) {

                            result = result.map(function(x) { return x.get({plain: true})});

                            var filteredBadges = badges.filter(function (b) {
                                return !_.find(result, {name: b});
                            }).map(function (b) {
                                return _.find(BADGES, {id: b});
                            });

                            // insert them into the db but not wait for it to finish
                            filteredBadges.forEach(function(badge) {
                                Badge.create({
                                    type: badge.type,
                                    name: badge.id,
                                    points: badge.points
                                }).then(function (b) {
                                    b.setUser(user);
                                });
                            });

                            return answer(filteredBadges, stats, action);

                        });
                    } else {
                        return answer([], data ? data.stats : {}, action);
                    }
                });

            };

            // if the action has an item-uuid add it to the action props
            if (body.item) {
                promise = Item.findOrCreate({where: {uuid: body.item}}).then(function(_item) {
                    var item = _item[0];
                    Action.create(actionProps).then(function(action) {
                        action.setItem(item);
                        action.setUser(user);
                        action.save().then(function (a) {
                            item.setActions([a]);
                            calcBadges(a);
                        });
                    });
                });
            } else {
                return Action.create(actionProps).then(function(action) {
                    action.setUser(user);
                    action.save().then(calcBadges);
                });
            }
        });
    });
};
