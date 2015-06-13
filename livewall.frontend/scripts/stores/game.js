import _                    from 'lodash';
import Reflux               from 'reflux';
import Immutable            from 'immutable';
import jquery               from 'jquery';
import moment               from 'moment';

import actions              from '../actions.js';
import {user}               from '../auth.js';
import {SETTINGS}           from '../settings.js';
import {track, api}         from '../owa.js';
import { trophieFunctions, badges } from '../badges.js';

// SETTINGS FOR POINTS

var pointsForActions = {
    vote: {
        up: 10,
        down: 10
    },
    search: {
        add: 20,
        remove: 20
    },
    auth: {
        login: 30
    },
    favourite: {
        toggle: 50
    }
};

//
// GAME STORE
//

export default Reflux.createStore({

    init: function () {

        this.items = Immutable.OrderedMap();

        this.listenTo(actions.upvoteItem,    this.upvoteItem);
        this.listenTo(actions.downvoteItem,  this.downvoteItem);
        this.listenTo(actions.favouriteItem, this.favouriteItem);
        this.listenTo(actions.addQuery,      this.addQuery);
        this.listenTo(actions.removeQuery,   this.removeQuery);

        this.state = {
            monthly: {
                user: {
                    trophies: {
                        trophies: [],
                        points: {
                            all: 0
                        }
                    },
                    results: {

                    }
                },
                users: [

                ]
            },
            alltime: {
                user: {
                    trophies: {
                        trophies: [],
                        points: {
                            all: 0
                        }
                    },
                    results: {

                    }
                },
                users: [

                ]
            }
        };

        // get the data after the user logs in
        user.whenLogedIn(() => {
            this.getMonthlyData().then(
                json => {
                    var processedData = this.processData(json.rows);
                    this.state.allTimeData = processedData;
                    return processedData;
                }).then(data => {
                    var monthlyData = _.map(data, (d, user) => {
                        return {
                            user: user,
                            trophies: this.calcTrophies(d, user),
                            rewards: this.calcRewards(d, user)
                        };
                    }).sort((a, b) => {
                        return a.points - b.points;
                    }).map((user, i) => {
                        user.place = i + 1;
                        return user;
                    });

                    var userData = _.find(monthlyData, {
                        user: user.username
                    });

                    this.state.monthly = {
                        user: userData,
                        users: monthlyData
                    };

                    this.trigger(this.state);
                });

            this.getAllTimeData().then(
                json => {
                    var processedData = this.processData(json.rows)
                    this.state.monthlyData = processedData;
                    return processedData;
                }).then(data => {

                    var alltimeData = _.map(data, (d, user) => {
                        return {
                            user: user,
                            trophies: this.calcTrophies(d, user),
                            rewards: this.calcRewards(d, user)
                        };
                    }).sort((a, b) => {
                        return a.points - b.points;
                    }).map((user, i) => {
                        user.place = i + 1;
                        return user;
                    });

                    var userData = _.find(alltimeData, {
                        user: user.username
                    });

                    this.state.alltime = {
                        user: userData,
                        users: alltimeData
                    };

                    console.log(this.state);

                    this.trigger(this.state);

                });

        });

    },

    getInitialState: function () {
        return this.state;
    },

    getAllTimeData: function () {
        var startDate = moment().subtract(10, 'years');
        var endDate   = moment();
        return this.getData(startDate, endDate);
    },

    getMonthlyData: function () {
        var startDate = moment().subtract(1, 'month');
        var endDate   = moment();
        return this.getData(startDate, endDate);
    },

    getData: function (startDate, endDate) {
        var constraints = {
        };
        var dimensions = [
            'date',
            'actionGroup',
            'actionName',
            'actionLabel',
            'customVarName2',
            'customVarValue2'
        ];
        return api(constraints, dimensions, startDate, endDate);
    },

    processData: function (data = []) {
        /* every row looks like this:

            date: "20150530",
            actionGroup: "search",
            actionName: "aussiehst",
            actionLabel: "add",
            customVarName2: "username",
            customVarValue2: "nick",
            actions: "1"

        */

        /* group by user/actionGroup/actionLabel, resulting data structure looks like this:
        {
            user1: {
                actionGroup1: {
                    actionLabel1: {
                        count: ...,
                        uniqueCount: ...,
                        data: all the rows,
                        group: ...,
                        user: ...
                    },
                    ...
                },
                ...
            },
            user2: ...
        }

        */
        var groupedData = _.chain(data)
            .filter(x => x.customVarValue2 !== '(not set)')
            .groupBy(x => x.customVarValue2)
            .mapValues(
                byUser => {
                    return _.chain(byUser)
                        .groupBy(x => x.actionGroup)
                        .mapValues(byGroup => {
                            return _.chain(byGroup)
                                .groupBy(x => x.actionLabel)
                                .mapValues(byLabel => {
                                    var first = _.first(byLabel);
                                    return {
                                        count:       _.sum(byLabel, x => _.parseInt(x.actions)),
                                        uniqueCount: byLabel.length,
                                        rows:        _.sortBy(byLabel, 'date'),
                                        label:       first.actionLabel,
                                        group:       first.actionGroup,
                                        user:        first.customVarValue2
                                    };
                                })
                                .value()
                        })
                        .value();
                }
            )
            .value();

        return groupedData;


    },

    calcRewards: function (data, user) {

        // rewards the user always has

        var rewards = ['color_pastel'];

        if (data.reward) {
            rewards = rewards.concat(_.keys(data.reward));
        }

        return rewards;

    },

    calcTrophies: function (data, user, group, label) {

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
            favourites: results.numberOfFavourites * pointsForActions.favourite.toggle,
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

    },

    addQuery: function (queryTerm, _track) {
        // we do not want to track the queries that are added when the wall is started
        if (_track) {
            track('search', queryTerm, 'add');
            this.state.alltime.user.trophies.points.all += pointsForActions.search.add;
            this.trigger(this.state);
        }
    },
    removeQuery: function (queryTerm) {
        track('search', queryTerm, 'remove');
        this.state.alltime.user.trophies.points.all += pointsForActions.search.remove;
        this.trigger(this.state);
    },

    upvoteItem: function (uuid) {
        track('vote', uuid, 'up');
        this.state.alltime.user.trophies.points.all += pointsForActions.vote.up;
        this.trigger(this.state);
    },

    downvoteItem: function (uuid) {
        track('vote', uuid, 'down');
        this.state.alltime.user.trophies.points.all += pointsForActions.vote.down;
        this.trigger(this.state);
    },

    favouriteItem: function (uuid) {
        track('favourite', uuid, 'toggle');
        this.state.alltime.user.trophies.points.all += pointsForActions.favourite.toggle;
        this.trigger(this.state);
    },

    addReward: function (id) {
        track('reward', '', id);
    }

});
