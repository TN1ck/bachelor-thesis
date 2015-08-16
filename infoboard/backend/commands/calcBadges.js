/**
 * Utility command that calculates the badges for all users in the system,
 * this is used normally in combination with the `fill.js` command
 */

var _      = require('lodash');
var models = require('../models');
var Promise = require("bluebird");
var POINTS = require('../../frontend/shared/gamification/points');
var BADGES = require('../../frontend/shared/gamification/badges');
var calculateBadges = require('../gamification/calculateBadges');

var User = models.User;
var Action = models.Action;
var Vote = models.Vote;
var Item = models.Item;
var Badge = models.Badge;
var sequelize = models.sequelize;

User.findAll().then(function(_users) {
    _users
    .forEach(function(user, i) {

        function createBadges (user) {
            return function (data) {
                // check which one the user already has
                return new Promise(function(resolve) {
                    if (data && data.badges && data.badges.length > 0) {

                        var badges = data.badges;
                        var stats  = data.stats;

                        user.getBadges().then(function(result, test) {

                            result = result.map(function(x) { return x.get({plain: true})});

                            var filteredBadges = badges.filter(function (b) {
                                var r = !_.find(result, {name: b});
                                return r;
                            }).map(function (b) {
                                return _.find(BADGES, {id: b});
                            });

                            var promises = filteredBadges.map(function(badge) {
                                return user.createBadge({
                                    type: badge.type,
                                    name: badge.id,
                                    points: badge.points
                                });
                            });

                            Promise.all(promises).then(resolve);

                        });
                    } else {
                        resolve({});
                    }
                });
            };
        }(user);

        calculateBadges({group: 'vote', label: 'up'}, user)
            .then(createBadges)
            .then(function() {
                return calculateBadges({group: 'vote', label: 'down'}, user);
            })
            .then(createBadges)
            .then(function() {
                return calculateBadges({group: 'query', label: 'add'}, user);
            })
            .then(createBadges)
            .then(function () {
                return calculateBadges({group: 'favourite', label: 'toggle'}, user)
            })
            .then(createBadges)
            .then(function () {
                return calculateBadges({group: 'auth', label: 'login'}, user);
            })
            .then(createBadges);

    });
});
