'use strict';

import _ from 'lodash';
import Reflux from 'reflux';
import Immutable from 'immutable';
import jquery from 'jquery';
import moment from 'moment';

import actions from '../actions.js';
import {user} from '../auth.js';
import {SETTINGS} from '../settings.js';
import {track, api} from '../owa.js';

export var badges = [
    {
        id: 'login_1',
        name: 'ANMELDUNG',
        number: '1',
        type: 'none',
        fill: '#9c4274',
        image: '/assets/key.png'
    },
    {
        id: 'login_3',
        name: 'TAGE IN FOLGE',
        number: '3',
        type: 'none',
        fill: '#F5A623',
        image: '/assets/repeat.png'
    },
    {
        id: 'login_7',
        name: 'TAGE IN FOLGE',
        number: '7',
        type: 'king',
        fill: '#F5A623',
        image: '/assets/repeat.png'
    },
    {
        id: 'repeat_15',
        name: 'TAGE IN FOLGE',
        number: '15',
        type: 'emperor',
        fill: '#F5A623',
        image: '/assets/repeat.png'
    },
    {
        id: 'upvotes_10',
        name: 'UPVOTES',
        number: '10',
        type: 'none',
        fill: '#96bf48',
        image: '/assets/upvote.png'
    },
    {
        id: 'upvotes_100',
        name: 'UPVOTES',
        number: '100',
        type: 'king',
        fill: '#96bf48',
        image: '/assets/upvote.png'
    },
    {
        id: 'upvotes_1000',
        name: 'UPVOTES',
        number: '1000',
        type: 'emperor',
        fill: '#96bf48',
        image: '/assets/upvote.png'
    },
    {
        id: 'downvotes_10',
        name: 'DOWNVOTES',
        number: '10',
        type: 'none',
        fill: '#ec663c',
        image: '/assets/downvote.png'
    },
    {
        id: 'downvotes_100',
        name: 'DOWNVOTES',
        number: '100',
        type: 'king',
        fill: '#ec663c',
        image: '/assets/downvote.png'
    },
    {
        id: 'downvotes_1000',
        name: 'DOWNVOTES',
        number: '1000',
        type: 'emperor',
        fill: '#ec663c',
        image: '/assets/downvote.png'
    },
    {
        id: 'search_100',
        name: 'SUCHEN',
        number: '100',
        type: 'none',
        fill: '#47bbb3',
        image: '/assets/search.png'
    },
    {
        id: 'search_1000',
        name: 'SUCHEN',
        number: '1000',
        type: 'king',
        fill: '#47bbb3',
        image: '/assets/search.png'
    },
    {
        id: 'search_10000',
        name: 'SUCHEN',
        number: '10000',
        type: 'emperor',
        fill: '#47bbb3',
        image: '/assets/search.png'
    },
    {
        id: 'favourites_10',
        name: 'FAVORITEN',
        number: '10',
        type: 'none',
        fill: '#248EE6',
        image: '/assets/star.png'
    },
    {
        id: 'favourites_100',
        name: 'FAVORITEN',
        number: '100',
        type: 'king',
        fill: '#248EE6',
        image: '/assets/star.png'
    },
    {
        id: 'favourites_1000',
        name: 'FAVORITEN',
        number: '1000',
        type: 'emperor',
        fill: '#248EE6',
        image: '/assets/star.png'
    }
];

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
            this.getMonthlyData.bind(this)();
            this.getAllTimeData.bind(this)();
        });

    },

    getAllTimeData: function () {
        var startDate = moment().subtract(10, 'years');
        var endDate   = moment();
        this.getData(startDate, endDate).then(json => {
            this.state.allTimeData = this.processData(json.rows);
        });
    },

    getMonthlyData: function () {
        var startDate = moment().subtract(1, 'month');
        var endDate   = moment();
        this.getData(startDate, endDate).then(json => {
            this.state.monthlyData = this.processData(json.rows);
        });
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
                                        data: byLabel,
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

        return groupedData;


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
        track('favourite', uuid);
    }

});
