import _ from 'lodash';
import Reflux from 'reflux';
import Immutable from 'immutable';
import jquery from 'jquery';
import moment from 'moment';

import actions from '../actions.js';
import {user} from '../auth.js';
import {SETTINGS} from '../settings.js';
import {track, api} from '../owa.js';
import { trophieFunctions } from '../badges.js';

export var gameStore = Reflux.createStore({

    init: function () {

        this.items = Immutable.OrderedMap();

        this.listenTo(actions.upvoteItem,    this.upvoteItem);
        this.listenTo(actions.downvoteItem,  this.downvoteItem);
        this.listenTo(actions.favouriteItem, this.favouriteItem);
        this.listenTo(actions.addQuery,      this.addQuery);
        this.listenTo(actions.removeQuery,   this.removeQuery);

        this.state = {
            points: 500,
            badges: ['login_1', 'login_3', 'login_7', 'login_15', 'favourites_10'],
            favourites: 10,
            upvotes: 100,
            downvotes: 100,
            searches: 100,
            number_of_logins: 20,
            consecutive_logins: 15
        };

        // get the data after the user logs in
        user.isLogedIn(() => {

            this.getMonthlyData().then(
                json => {
                    var processedData = this.processData(json.rows);
                    this.state.allTimeData = processedData;
                    return processedData;
                }).then(data => {

                });

            this.getAllTimeData().then(
                json => {
                    var processedData = this.processData(json.rows)
                    this.state.monthlyData = processedData;
                    return processedData;
                }).then(data => {
                    this.leaderboard = _.map(data, (d, user) => {
                        return {
                            user: user,
                            trophies: this.calcTrophies(d, user)
                        };
                    });
                    console.log(this.leaderboard);

                });

        });

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
                                        count: _.sum(byLabel, x => _.parseInt(x.actions)),
                                        uniqueCount: byLabel.length,
                                        rows: _.sortBy(byLabel, 'date'),
                                        label: first.actionLabel,
                                        group: first.actionGroup,
                                        user: first.customVarValue2
                                    };
                                })
                                .value()
                        })
                        .value();
                }
            )
            .value();
        console.log(groupedData);
        return groupedData;


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
        console.log(trophieResults, user);
        var trophies = _.chain(trophieResults).map(x => x.trophies).flatten().value();
        var results  = _.spread(_.merge)(trophieResults.map(x => x.results));

        return {
            trophies: trophies,
            results: results
        };

    },

    addQuery: function (queryTerm, load, _track) {
        if (_track) {
            track('search', queryTerm, 'add');
        }
    },
    removeQuery: function (queryTerm) {
        track('search', queryTerm, 'remove');
    },

    upvoteItem: function (uuid) {
        track('vote', uuid, 'up');
    },

    downvoteItem: function (uuid) {
        track('vote', uuid, 'down');
    },

    favouriteItem: function (uuid) {
        track('favourite', uuid, 'toggle');
    }

});
