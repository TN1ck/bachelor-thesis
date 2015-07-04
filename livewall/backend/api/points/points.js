var models = require('../../models');
var moment = require('moment');
var _       = require('lodash');

var POINTS = require('../../../frontend/shared/gamification/points');
var BADGES = require('../../../frontend/shared/gamification/badges');

var User = models.User;
var Action = models.Action;
var Vote = models.Vote;
var Item = models.Item;
var Badge = models.Badge;
var sequelize = models.sequelize;

module.exports = function (req, res) {

    var dateFrom = req.from ? moment(req.from) : moment().subtract(10, 'years');
    var dateTo   = req.to   ? moment(req.to)   : moment();

    var where = {
        createdAt: {
            $gt: dateFrom.toDate(),
            $lt: dateTo.toDate()
        }
    };

    console.time('points query');
    User.findAll({
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
                model: Badge,
            }
        ],
        group: [
            'Actions.label',
            'Badges.id',
            'User.id'
        ]
    }).then(function(users) {

        console.timeEnd('points query');

        users = users.map(function (x) { return x.get({plain: true}); });

        // hydrate users with their accumulated actions and badges
        users = users.map(function (user) {
            var actions = user.Actions;
            var badges  = user.Badges;
            var actionsPoints = _.sum(actions, 'points');
            var badgesPoints  = _.sum(badges,  'points');

            var all = actionsPoints + badgesPoints;

            var points = {
                all: all,
                badges: badgesPoints,
                actions: actionsPoints,
            };

            return {
                username: user.username,
                id: user.id,
                badges: badges,
                actions: actions,
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

        users.forEach(function(user) {

            badgesAccAll.points  += user.points.badges;
            badgesAccAll.count   += user.badges.length;

            actionsAccAll.points += user.points.actions;

            user.actions.forEach(function (action) {
                actionsAcc[action.group][action.label].points += action.points;
                actionsAcc[action.group][action.label].count += action.count;
                actionsAccAll.count  += action.count;
            });


            user.badges.forEach(function (badge) {
                badgesAcc[badge.name].points += badge.points;
                badgesAcc[badge.name].count  += 1;
            });

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

        res.json({
            users: users,
            points: badgesAccAll.points + actionsAccAll.points,
            count:  badgesAccAll.count  + actionsAccAll.count,
            actions: actionsAcc,
            badges: badgesAcc
        });
    });
};
