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
import pointsForActions   from '../../shared/gamification/points.js';

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

        // get the data after the user logs in
        user.whenLogedIn(() => {

            this.postAction('auth', 'login');

            api.getActions().then(result => {
                this.state.actions = result.actions;
                this.trigger(this.state);
            });

            pointApi.getMonthlyPoints().then(result => {
                this.state.monthly = result;
                this.trigger(this.state);
            });

            pointApi.getAllTimePoints().then(result => {
                this.state.alltime = result;
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

        api.postAction(dict).then((answer) => {
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
    },

    updateUserPoints: function (answer) {

        var {action, badges, stats} = answer;

        var {
            group, label, points
        } = action;

        [this.state.alltime.user, this.state.monthly.user].forEach((state) => {
            state.points.all += points;
            var oldPoints = _.get(state, ['actions', group, label], 0);
            _.set(state, ['actions', group, label], points + oldPoints);

        });

        this.trigger(this.state);

    },

    addQuery: function (queryTerm, track) {
        // we do not want to track the queries that are added when the wall is started
        if (track) {
            owa.track('search', queryTerm, 'add');
            this.postAction('search', 'add', queryTerm);

        }
    },
    removeQuery: function (queryTerm) {
        owa.track('search', queryTerm, 'remove');
        this.postAction('search', 'remove', {value: queryTerm});
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
        postBooster(id).then((booster) => {
            actions.addFlashMessage({
                type: 'booster',
                content: booster
            });
            this.alltime.user.booster.push(booster);
            this.trigger(this.state);
        });
    }

});
