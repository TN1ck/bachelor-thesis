var _               = require('lodash');
var moment          = require('moment');
var Promise         = require('bluebird');
var io              = require('../socket.js');
var models          = require('../../models');
var calculatePoints = require('../points/calculatePoints.js');
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
    var value    = body.value;

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
            }),
            user.getActions({
                where: {
                    createdAt: {
                        $gt: today
                    }
                },
                include: [
                    {model: Item}
                ]
            })
        ]).then(function (results) {
            var booster = _.last(_.sortBy(results[0], function (b) {
                return b.get('createdAt');
            }));

            var authAction = results[1];
            var allActions = results[2];

            var createActionAndAnswer = function (props) {
                return Action.create(actionProps).then(function (action) {
                    res.json(action);
                });
            };

            var points = _.get(POINTS, [group, label], 0);

            if (booster) {
                // there should always be only one Booster
                points = points * booster.get('multiplicator');
            }

            // authentication is allowed once per day
            if (group === 'auth' && label === 'login' && authAction) {
                points = 0;
            }

            // if its a vote or a favourite, check if the item was already rated today
            if (group === 'vote' || group === 'favourite') {

                var _action = _.find(allActions, function (a) {
                    var _item = a.get('Item');
                    if (!_item) {
                        return false;
                    }
                    return _item.get('uuid') === body.item;
                });

                // action with same uuid found, give no points
                if (_action) {
                    points = 0;
                }
            }

            // query for the term will only gain the user points once a day
            if (group === 'query') {
                var _action = _.find(allActions, function (a) {
                    return a.get('value') === value;
                });

                if (_action) {
                    points = 0;
                }
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

                // update info screen
                io.emit('action_created', {
                    user: user,
                    action: action,
                    badges: badges
                });

                // update the points off all clients
                Promise.all([
                    calculatePoints(),
                    calculatePoints(
                        moment().subtract(30, 'days'),
                        moment()
                    )
                ]).then(function (results) {
                    io.emit('updated_points', {
                        all: results[0],
                        monthly: results[1]
                    });
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
