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

//
// GAME STORE
//

export default Reflux.createStore({

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

        // WEBSOCKET
        this.socket = io(SETTINGS.SOCKET_URL);
        this.socket.on('connect', function () {
            console.log('connection is working!');
        });

        this.socket.on('action_created', (action) => {
            this.state.actions.unshift(action);
            this.updateGlobalPoints(action);
            this.trigger(this.state);
        });

        this.items = Immutable.OrderedMap();

        this.listenTo(actions.voteItem,      this.voteItem);
        this.listenTo(actions.favouriteItem, this.favouriteItem);
        this.listenTo(actions.addQuery,      this.addQuery);
        this.listenTo(actions.removeQuery,   this.removeQuery);
        this.listenTo(actions.buyBooster,   this.buyBooster);

        // get the data after the user logs in
        user.whenLogedIn(() => {

            pointApi.getMonthlyPoints().then(result => {
                this.state.monthly = result;
                this.trigger(this.state);
            });

            pointApi.getAllTimePoints().then(result => {
                this.state.alltime = result;
                this.calcLevel();
                this.trigger(this.state);
            }).then(() => {
                this.postAction('auth', 'login');
            });

            api.getActions().then(result => {
                this.state.actions = result.actions;
                this.trigger(this.state);
            });
        });

    },

    getInitialState: function () {
        return this.state;
    },

    postAction: function (group, label, _dict) {

        var dict = {
            group: group,
            label: label
        };

        if (_dict) {
            dict = _.extend(dict, _dict);
        }

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

    addQuery: function (queryTerm, track) {
        // we do not want to track the queries that are added when the wall is started
        if (track) {
            owa.track('query', queryTerm, 'add');
            this.postAction('query', 'add', queryTerm);

        }
    },
    removeQuery: function (queryTerm) {
        owa.track('query', queryTerm, 'remove');
        this.postAction('query', 'remove', {value: queryTerm});
    },

    voteItem: function (uuid, value) {
        var label = value > 0 ? 'up' : 'down';
        owa.track('vote', uuid, label);
        this.postAction('vote', label, {
            item: uuid,
            value: uuid
        });
    },

    favouriteItem: function (uuid) {
        owa.track('favourite', uuid, 'toggle');
        this.postAction('favourite', 'toggle', {
            item: uuid,
            value: uuid
        });

    },

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
