import _                  from 'lodash';
import Reflux             from 'reflux';
import Immutable          from 'immutable';
import $                  from 'jquery';
import moment             from 'moment';
import io                 from 'socket.io-client';

import actions            from '../actions/actions.js';
import {user}             from '../auth.js';
import SETTINGS           from '../settings.js';
import * as owa           from '../owa.js';
import * as pointApi      from '../api/points.js';
import * as api           from '../api/api.js';
import LEVELS             from '../../shared/gamification/levels.js';

/**
 * The Gamestore handles everything related to gamification:
 * Send every action to the backend, provide leaderboards/points and
 * Listen to the actions of others via a websocket.
 */
export default Reflux.createStore({

    /**
     * Initialization of the Gamestore, will set the inital state, create the listeners,
     * open a websocket to listen to changes by others and fetch the leaderboards/points when
     * the user sucessfully authenticated.
     */
    init: function () {

        var initialState = {
            user: {
                booster: [],
                badges: [],
                actions: [],
                points: {
                    all: 0,
                    place: 0,
                    badges: 0,
                }
            },
            users: [

            ],
            points: 0,
            badges: {all: 0},
            actions: {}
        };

        this.state = {
            actions: [],
            level: 0,
            monthly: initialState,
            alltime: initialState
        };

        this.items = Immutable.OrderedMap();

        this.listenTo(actions.voteItem,      this.voteItem);
        this.listenTo(actions.favouriteItem, this.favouriteItem);
        this.listenTo(actions.addQuery,      this.addQuery);
        this.listenTo(actions.removeQuery,   this.removeQuery);
        this.listenTo(actions.buyBooster,   this.buyBooster);

        // request the leaderboards and the points when the user sucessfully
        // authenticated
        user.whenLogedIn(() => {

            pointApi.getMonthlyPoints().then(result => {
                this.state.monthly = result;
                this.trigger(this.state);
            });

            pointApi.getAllTimePoints().then(result => {
                this.state.alltime = result;
                this.calcLevel();
                this.trigger(this.state);

                // open the websocket and listen to actions by others, update
                // the global points when an action happened
                this.socket = io(SETTINGS.SOCKET_URL);
                this.socket.on('connect', function () {
                    console.log('connection is working!');
                });

                this.socket.on('action_created', (action) => {
                    this.state.actions.unshift(action);
                    this.state.actions.pop();
                    this.updateGlobalPoints(action);
                    this.trigger(this.state);
                });


            }).then(() => {
                this.postAction('auth', 'login');
            });

            api.getActions().then(result => {
                this.state.actions = result.actions;
                this.trigger(this.state);
            });

        });

    },

    /**
     * Returns the state of the store
     * @returns the state
     */
    getInitialState: function () {
        return this.state;
    },

    /**
     * Post an action to the backend and check for badges in the answer
     *
     * @param {string} group The group of the action
     * @param {string} label The label of the action
     * @param {Object} _dict Other values that will be send
     * @returns
     */
    postAction: function (group, label, _dict) {

        var dict = {
            group: group,
            label: label
        };

        if (_dict) {
            dict = _.extend(dict, _dict);
        }

        /* post the action to the backend and create flashmessages for new
           badges */
        return api.postAction(dict).then((answer) => {
            var {action, badges} = answer;
            if (badges.length > 0) {
                badges.forEach((badge) => {
                    actions.addFlashMessage({
                        type: 'badge',
                        content: badge
                    });
                });
            }

            this.updateUserPoints(answer);

        });
    },

    updateGlobalPoints: function (answer) {
        var {action, badges, states} = answer;

        var {
            group, label, points
        } = action;

        [this.state.alltime, this.state.monthly].forEach((state) => {
            state.points += points;
            var oldPoints = _.get(state, ['actions', group, label], {
                count: 0,
                points: 0
            });
            _.set(state, ['actions', group, label, 'points'], points + oldPoints.points);
            _.set(state, ['actions', group, label, 'count'],  1 + oldPoints.count);


            badges.forEach(b => {
                var oldBadgesPoints = _.get(state, ['badges', 'all'], {
                    count: 0,
                    points: 0
                });
                state.points += b.points;
                _.set(state, ['badges', 'all', 'count'],  1 + oldBadgesPoints.count);
                _.set(state, ['badges', 'all', 'points'], b.points + oldBadgesPoints.points);
            });

        });

        this.trigger(this.state);
    },

    updateUserPoints: function (answer) {

        var {action, badges, stats} = answer;

        var {
            group, label, points
        } = action;

        [this.state.alltime.user, this.state.monthly.user].forEach((state) => {
            state.points.all += points;
            var oldPoints = _.get(state, ['actions', group, label], {
                count: 0,
                points: 0
            });
            _.set(state, ['actions', group, label, 'points'], points + oldPoints.points);
            _.set(state, ['actions', group, label, 'count'],  1 + oldPoints.coint);

            state.badges = state.badges.concat(badges || []);

            badges.forEach(b => {
                var oldBadgesPoints = _.get(state, ['points', 'badges'], 0);
                state.points.all    += b.points;
                state.points.badges = oldBadgesPoints + b.points;
            });

        });
        this.calcLevel();
        this.trigger(this.state);

    },

    calcLevel: function () {
        var current = this.state.level;
        var level = (_.findLast(LEVELS, (level) => {
            return level.points <= this.state.alltime.user.points.all;
        }) || LEVELS[0]);

        // user arrived new level, send message
        if (current !== 0 && level.level > current) {
            actions.addFlashMessage({
                type: 'level',
                content: level
            });
        }

        this.state.level = level.level;

    },

    /**
     * Track the querying of a new query if `track` is `true`
     *
     * @param {string} queryTerm The term that was queried
     * @param {bool} track Specifies if the query should be tracked
     */
    addQuery: function (queryTerm, track) {
        // we do not want to track the queries that are added when the wall is started
        if (track) {
            owa.track('query', queryTerm, 'add');
            this.postAction('query', 'add', queryTerm);
        }
    },

    /**
     * Track the removement of a query
     *
     * @param {string} queryTerm The query that was removed by the user
     */
    removeQuery: function (queryTerm) {
        owa.track('query', queryTerm, 'remove');
        this.postAction('query', 'remove', {value: queryTerm});
    },

    /**
     * Track the vote of an item
     *
     * @param {string} uuid The uuid of the item
     * @param {number} value The vote-amount
     */
    voteItem: function (uuid, value) {
        var label = value > 0 ? 'up' : 'down';
        owa.track('vote', uuid, label);
        this.postAction('vote', label, {
            item: uuid,
            value: uuid
        });
    },

    /**
     * Track the favourting/unfavouriting of an item
     *
     * @param {string} uuid The uuid of the item
     */
    favouriteItem: function (uuid) {
        owa.track('favourite', uuid, 'toggle');
        this.postAction('favourite', 'toggle', {
            item: uuid,
            value: uuid
        });

    },

    /**
     * Buy a booster for the current user, show a flash message after
     * the booster is sucessfully bought
     *
     * @param {string} id The id of the booster
     */
    buyBooster: function (id) {
        api.postBooster(id).then((booster) => {
            actions.addFlashMessage({
                type: 'booster',
                content: booster
            });
            this.state.alltime.user.booster.push(booster);
            this.state.monthly.user.booster.push(booster);
            this.trigger(this.state);
        });
    }

});
