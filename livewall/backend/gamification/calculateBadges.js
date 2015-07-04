var models = require('../models');
var _       = require('lodash');

var User = models.User;
var Action = models.Action;
var Vote = models.Vote;
var Item = models.Item;

var authLoginTrophies = function (user) {
    return user.getActions({where: {group: 'auth', label: 'login'}}).then(function(actions) {
        console.log(actions);
        return {
            stats: {

            },
            badges: []
        }
    });
};

var addQuerieTrophies = function (user) {
    return user.getActions({where: {group: 'queries', label: 'add'}}).then(function(actions) {
        console.log(actions);
        return {
            stats: {

            },
            badges: []
        }
    });
};

var voteUpTrophies = function (user) {
    return user.getActions({where: {group: 'vote', label: 'up'}}).then(function(actions) {

        var badges = [];

        var count = actions.length;

        if (count >= 10) {
            badges.push('upvotes_10');
        }

        if (count >= 100) {
            badges.push('upvotes_100');
        }

        if (count >= 1000) {
            badges.push('upvotes_1000');
        }

        return {
            stats: {
                numberOfUpvotes: count
            },
            badges: badges
        };
    });
};

var voteDownTrophies = function (user) {
    return user.getActions({where: {group: 'vote', label: 'down'}}).then(function(actions) {
        var badges = [];

        var count = actions.length;

        if (count >= 10) {
            badges.push('downvotes_10');
        }

        if (count >= 100) {
            badges.push('downvotes_100');
        }

        if (count >= 1000) {
            badges.push('downvotes_1000');
        }

        return {
            stats: {
                numberOfDownvotes: count
            },
            badges: badges
        };
    });
};

var toggleFavouriteTrophies = function (user) {
    return user.getActions({where: {group: 'favourite', label: 'toggle'}}).then(function(actions) {
        console.log(actions);
        return {
            stats: {

            },
            badges: []
        }
    });
};


var calcBadges = {
    favourite: {
        toggle: toggleFavouriteTrophies
    },
    queries: {
        add: addQuerieTrophies
    },
    vote: {
        up: voteUpTrophies,
        down: voteDownTrophies
    },
    auth: {
        login: authLoginTrophies
    }
};

module.exports = function (action, user) {
    var group = action.group;
    var label = action.label;

    var fn = _.get(calcBadges, [group, label]);

    if (fn) {
        return fn(user);
    } else {
        return {};
    }
};
