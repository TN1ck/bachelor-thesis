import { trophieFunctions, badges } from '../gamification/badges.js';
import {pointsForActions}           from '../gamification/points.js';
import * as owa                     from '../owa.js';
import {user}                       from '../auth.js';

export var getMonthlyLeaderBoard = () => {
    return owa.getMonthlyUserData()
        .then(hydrateData);
};

export var getAllTimeLeaderBoard = () => {
    return owa.getAllTimeUserData()
        .then(hydrateData);
};

var hydrateData = (data) => {
    var hydratedData = _.map(data, (d, user) => {
        return {
            user: user,
            trophies: calcTrophies(d, user),
            rewards: calcRewards(d, user)
        };
    }).sort((a, b) => {
        return a.points - b.points;
    }).map((user, i) => {
        user.place = i + 1;
        return user;
    });

    var userData = _.find(hydratedData, {
        user: user.username
    });

    return {
        user: userData,
        users: hydratedData
    }
};

var calcTrophies = function (data, group, label) {

    if (group && label) {
        var trophieFunction = _.get(trophieFunctions, [group, label]);

        if (trophieFunction)  {
            return trophieFunction(data);
        } else {
            console.error('trophie-function does not exist', group, label);
        }
    }

    var flatFunctions = _.chain(trophieFunctions).map(x => _.values(x)).merge().values().flatten().value();

    var trophieResults = flatFunctions.map(fn => fn(data));
    var trophies = _.chain(trophieResults).map(x => x.trophies).flatten().value();
    var results  = _.spread(_.merge)(trophieResults.map(x => x.results));

    // add default values
    results = _.extend({
        numberOfUpvotes:    0,
        numberOfDownvotes:  0,
        numberOfFavourites: 0,
        numberOfLogins:     0,
        numberOfQueries:    0
    }, results);

    //
    // calculate the resulting points
    //

    // for the trophies

    var pointsForTrophies = trophies.reduce((prev, curr) => {
        var p = _.find(badges, x => x.id === curr).points;
        return prev + p;
    }, 0);

    // for the actions

    var points = {
        vote: results.numberOfDownvotes  * pointsForActions.vote.down +
              results.numberOfUpvotes    * pointsForActions.vote.up,
        favourite: results.numberOfFavourites * pointsForActions.favourite.toggle,
        auth: results.numberOfLogins     * pointsForActions.auth.login,
        search: results.numberOfQueries    * pointsForActions.search.add +
                results.numberOfQueries    * pointsForActions.search.remove,
        trophies: pointsForTrophies
    };

    points.all = _.sum(_.values(points));

    return {
        points: points,
        trophies: trophies,
        results: results
    };

};

var calcRewards = () => {
    return [];
};
