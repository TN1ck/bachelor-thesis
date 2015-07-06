var _               = require('lodash');
var io              = require('../socket.js');
var models          = require('../../models');
var calculateBadges = require('../../gamification/calculateBadges');
var POINTS          = require('../../../frontend/shared/gamification/points');
var badgesList      = require('../../../frontend/shared/gamification/badges');

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
    var user = User.findOrCreate({
        where: {username: username}
    }).then(_.first).then(function(user) {
        user.getBoosters({
            where: {
                validUntil: {
                    $gt: new Date()
                }
            }
        }).then(function (booster) {
            var createActionAndAnswer = function (props) {
                return Action.create(actionProps).then(function (action) {
                    // action sucessfully created
                    res.json(action);
                });
            };

            var points = _.get(POINTS, [group, label], 0);

            if (booster) {
                // there should always be only one Booster
                points = points * _.get(booster, '[0].multiplicator', 1);
            }

            console.log(points, user);

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
            };

            var calcBadges = function(action) {

                var badges = [];
                var stats = {};

                // recalculate the badges and points
                var result = calculateBadges(action, user);

                if (result && result.then) {
                    result.then(function (data) {

                        // check which one the user already has
                        if (data && data.badges && data.badges.length > 0) {

                            badges = data.badges;
                            stats  = data.stats;

                            user.getBadges({where: {name: badges}}).then(function(result) {

                                result = result.map(function(x) { return x.get({plain: true})});
                                // the user got new badges!
                                if (result.length !== badges.length) {

                                    var filteredBadges = badges.filter(function (b) {
                                        return !_.find(result, {name: b});
                                    });

                                    // insert them into the db but not wait for it to finish
                                    filteredBadges.forEach(function(badge) {
                                        var _badge = _.find(badgesList, {id: badge});
                                        Badge.create({
                                            type: _badge.type,
                                            name: _badge.id,
                                            points: _badge.points
                                        }).then(function (b) {
                                            b.setUser(user);
                                        });
                                    });

                                    return answer(badges, stats, action);

                                } else {
                                    return answer([], stats, action);
                                }
                            });
                        } else {
                            return answer([], data ? data.stats : {}, action);
                        }
                    });
                } else {
                    return answer(badges, stats, action);
                }
            };

            // if the action has an item-uuid add it to the action props
            if (body.item) {
                promise = Item.findOrCreate({where: {uuid: body.item}}).then(function(_item) {
                    var item = _item[0];
                    Action.create(actionProps).then(function(action) {

                        io.emit('action_created', {
                            user: user,
                            action: action,
                            item: item
                        });

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

                    io.emit('action_created', {
                        user: user,
                        action: action,
                        item: {}
                    });

                });
            }
        });
    });
};
