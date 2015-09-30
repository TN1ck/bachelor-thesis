var models = require('../../models');
var moment = require('moment');
var _       = require('lodash');

var hideUsers = require('../../config/gamification.js').hideUsers;

var POINTS = require('../../../frontend/shared/gamification/points');
var BADGES = require('../../../frontend/shared/gamification/badges');

var User = models.User;
var Action = models.Action;
var Vote = models.Vote;
var Item = models.Item;
var Badge = models.Badge;
var Booster = models.Booster;
var sequelize = models.sequelize;

module.exports = function (from, username) {

    var dateFrom = from ? moment(from) : moment().subtract(10, 'years');

    var where = {
        createdAt: {
            $gt: dateFrom.toDate()
        }
    };

    return User.findAll({
        include: [
            {
                where: where,
                model: Action,
                attributes: [
                    'group',
                    'label',
                    [
                        models.sequelize.fn('sum', models.sequelize.col('Actions.points')),
                        'points'
                    ],
                    [
                        models.sequelize.fn('count', models.sequelize.col('*')),
                        'count'
                    ],
                ],
            },
            {
                model: Booster,
            },
            {
                model: Badge,
            }
        ],
        where: {
            username: {
                $notIn: hideUsers
            }
        },
        group: [
            'Actions.label',
            'Badges.id',
            'User.id',
            'Boosters.id'
        ]
    }).then(function(users) {

        users = users.map(function (x) { return x.get({plain: true}); });

        // hydrate users with their accumulated actions and badges
        users = users.map(function (user) {

            var actions = user.Actions;
            var badges  = user.Badges.map(function (b) {
                return _.find(BADGES, {id: b.name})
            });
            var booster = user.Boosters || [];

            var actionsPoints = 0;
            var badgesPoints  = _.sum(badges,  'points');
            var boosterPoints = _.sum(booster, 'points');


            // bring actions into correct structure
            actions = _.mapValues(POINTS, function (v, group) {
                return _.mapValues(v, function (vv, label) {
                    var res = _.find(actions, {
                        group: group,
                        label: label
                    }) || {
                        points: 0,
                        count: 0
                    };
                    actionsPoints += res.points;
                    return _.pick(res, ['points', 'count']);
                });
            });

            var all = actionsPoints + badgesPoints - boosterPoints;

            var points = {
                all: all,
                badges: badgesPoints,
                actions: actionsPoints,
                booster: boosterPoints
            };

            return {
                username: user.username,
                id: user.id,
                badges: badges,
                actions: actions,
                booster: booster,
                points: points
            };
        });

        // accumulate action-points/count over all users
        var actionsAcc = _.extend({}, POINTS);

        var zerofn = function () {
            return {points: 0, count: 0};
        };

        // set to zero
        actionsAcc = _.mapValues(actionsAcc, function (group) {
            return _.mapValues(group, zerofn);
        });

        var actionsAccAll = {
            points: 0,
            count: 0
        };

        // accumalate badges-points/count over all users
        var badgesAcc = _.object(_.pluck(BADGES, 'id'), _.times(BADGES.length, zerofn));

        var badgesAccAll = {
            points: 0,
            count: 0
        };

        var boosterAccAll = {
            points: 0,
            count: 0
        };

        users.forEach(function(user) {

            badgesAccAll.points  += user.points.badges;
            badgesAccAll.count   += user.badges.length;

            actionsAccAll.points += user.points.actions;

            _.each(user.actions, function (v, group) {
                _.each(v, function (vv, label) {
                    actionsAcc[group][label].points += vv.points;
                    actionsAcc[group][label].count  += vv.count;
                    actionsAccAll.count             += vv.count;
                });
            });


            user.badges.forEach(function (badge) {
                badgesAcc[badge.id].points += badge.points;
                badgesAcc[badge.id].count  += 1;
            });

            boosterAccAll.points += _.get(user, '.points.booster', 0);
            boosterAccAll.count  += _.get(user, '.booster.length', 0);

        });

        badgesAcc.all = badgesAccAll;
        actionsAcc.all = actionsAccAll;

        // sort and add place
        users = _.sortBy(users, function (user) {
            return -user.points.all;
        }).map(function (user, i) {
            user.place = i + 1;
            return user;
        });

        return {
            users: users,
            points: badgesAccAll.points + actionsAccAll.points,
            pointsWithBoosters:  badgesAccAll.points + actionsAccAll.points - boosterAccAll.points,
            count:  badgesAccAll.count  + actionsAccAll.count + boosterAccAll.count,
            actions: actionsAcc,
            badges: badgesAcc,
            booster: boosterAccAll
        };
    });
};
