import _                  from 'lodash';
import Reflux             from 'reflux';
import Immutable          from 'immutable';
import io                 from 'socket.io-client';

import actions            from '../actions/actions.js';
import {user}             from '../auth.js';
import SETTINGS           from '../settings.js';
// import * as owa           from '../owa.js';
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
                    badges: 0
                }
            },
            users: [

            ],
            points: 0,
            badges: {all: 0},
            actions: {}
        };

        this.state = {
            activities: [],
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
                this.state.monthly = this.processPoints(result);
                this.trigger(this.state);
            });

            pointApi.getAllTimePoints().then(result => {
                this.state.alltime = this.processPoints(result);
                this.calcLevel();
                this.trigger(this.state);

                this.initSockets();

            }).then(() => {
                api.getActivities().then(result => {
                    this.state.activities = result.activities;
                });
                this.postAction('auth', 'login');
            });

        });

    },

    /**
     * Initialize the websocket-channels
     */
    initSockets: function () {

        // open the websocket and listen to acivities by others, update
        // the global points when an activity happened
        this.socket = io(SETTINGS.SERVER_URL);

        this.socket.on('updated_points', ({monthly, all}) => {
            this.state.monthly = this.processPoints(monthly);
            this.state.alltime = this.processPoints(all);
            this.calcLevel();
            this.trigger(this.state);
        });

        this.socket.on('activity_created', (activity) => {

            this.state.activities.unshift(activity);
            this.state.activities = this.state.activities.slice(0, 30);

            this.trigger(this.state);
        });

    },

    /**
     * Process the pointApi-result and hydrate the local user
     * @param result - The result of the pointApi-call
     * @returns The points-data from the backend hydrated with the local user
     */
    processPoints: function (result) {
        return _.extend(result, {
            user: _.find(result.users, {username: user.username})  || {
                booster: [],
                badges: [],
                actions: [],
                points: {
                    all: 0
                }
            }
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
            var {badges} = answer;
            if (badges.length > 0) {
                badges.forEach((badge) => {
                    actions.addFlashMessage({
                        type: 'badge',
                        content: badge
                    });
                });
            }

            // this.updateUserPoints(answer);

        });
    },

    updateUserPoints: function (answer) {

        var {action, badges} = answer;

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
        var level = (_.findLast(LEVELS, (_level) => {
            return _level.points <= this.state.alltime.user.points.withoutBooster;
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
            // owa.track('query', queryTerm, 'add');
            this.postAction('query', 'add', {value: queryTerm});
        }
    },

    /**
     * Track the removement of a query
     *
     * @param {string} queryTerm The query that was removed by the user
     */
    removeQuery: function (queryTerm) {
        // owa.track('query', queryTerm, 'remove');
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
        // owa.track('vote', uuid, label);
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
        // owa.track('favourite', uuid, 'toggle');
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
