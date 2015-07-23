var models = require('../models');
var _       = require('lodash');
var moment  = require('moment');

var User = models.User;
var Action = models.Action;
var Vote = models.Vote;
var Item = models.Item;

var authLoginBadges = function (user) {
    return user.getActions({
        where: {group: 'auth', label: 'login'},
        order: [['createdAt', 'DESC']]
    }).then(function(actions) {
        var badges = [];

        var format = 'YYYY-MM-DD';

        // plain objects
        actions = actions.map(function(action) {
            var plain = action.get({plain: true});
            plain.createdAt = moment(plain.createdAt);
            return plain;
        });

        // remave date duplicates, day-precision
        actions = _.unique(actions, true, function (action) {
            return action.createdAt.format(format);
        });

        // iterate over the sorted array and if consecutive rows are 1 day apart
        // the logins are also consecutive
        var maxConsecutiveLogins = 1;
        var current = 1;

        var last = _.first(actions);

        _.rest(actions).forEach(function (action) {

            var lastDate = last.createdAt;
            var date     = action.createdAt;

            var nextDay = moment(lastDate).add(1, 'day');

            if (nextDay.format(format) === date.format(format)) {
                current += 1;
            } else {
                maxConsecutiveLogins = Math.max(current, maxConsecutiveLogins);
                current = 1;
            }

            last = action;

        });

        maxConsecutiveLogins = Math.max(current, maxConsecutiveLogins);

        var numberOfLogins = actions.length;

        if (numberOfLogins >= 1) {
            badges.push('login_1');
        }

        if (numberOfLogins >= 50) {
            badges.push('login_50');
        }

        if (numberOfLogins >= 50) {
            badges.push('login_100');
        }


        if (maxConsecutiveLogins >= 3) {
            badges.push('login_3_c');
        }
        if (maxConsecutiveLogins >= 7) {
            badges.push('login_7_c');
        }
        if (maxConsecutiveLogins >= 15) {
            badges.push('login_15_c');
        }

        return {
            stats: {
                maxConsecutiveLogins: maxConsecutiveLogins,
                numberOfLogins: numberOfLogins
            },
            badges: badges
        };
    });
};

var addQueryBadges = function (user) {
    return user.getActions({where: {group: 'query', label: 'add'}}).then(function(actions) {
        var badges = [];

        var count = actions.length;

        if (count >= 10) {
            badges.push('queries_add_10');
        }

        if (count >= 100) {
            badges.push('queries_add_100');
        }

        if (count >= 1000) {
            badges.push('queries_add_1000');
        }

        return {
            stats: {
                numberOfUpvotes: count
            },
            badges: badges
        };
    });
};

var voteUpBadges = function (user) {
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

var voteDownBadges = function (user) {
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

var toggleFavouriteBadges = function (user) {
    return user.getActions({where: {group: 'favourite', label: 'toggle'}}).then(function(actions) {
        var badges = [];

        var count = actions.length;

        if (count >= 10) {
            badges.push('favourites_10');
        }

        if (count >= 50) {
            badges.push('favourites_50');
        }

        if (count >= 100) {
            badges.push('favourites_100');
        }

        return {
            stats: {
                numberOfFavourites: count
            },
            badges: badges
        };
    });
};


var calcBadges = {
    favourite: {
        toggle: toggleFavouriteBadges
    },
    query: {
        add: addQueryBadges
    },
    vote: {
        up: voteUpBadges,
        down: voteDownBadges
    },
    auth: {
        login: authLoginBadges
    }
};

module.exports = function (action, user) {
    return new Promise(function (resolve) {
        var group = action.group;
        var label = action.label;

        var fn = _.get(calcBadges, [group, label]);

        if (fn) {
            fn(user).then(resolve);
        } else {
            return resolve({});
        }
    });
};
