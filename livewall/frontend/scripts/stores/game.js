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
import {
    postAction,
    getActions
}                         from '../api/api.js';
import pointsForActions   from '../../shared/gamification/points.js';

//
// GAME STORE
//

export default Reflux.createStore({

    init: function () {

        this.state = {
            actions: [],
            monthly: {
                user: {
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
            },
            alltime: {
                user: {
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
            }
        };

        // WEBSOCKET
        this.socket = io(SETTINGS.SOCKET_URL);
        this.socket.on('connect', function () {
            console.log('connection is working!');
        });

        this.socket.on('action_created', (msg) => {
            this.state.actions.unshift(msg);
            this.trigger(this.state);
        });

        this.items = Immutable.OrderedMap();

        this.listenTo(actions.voteItem,      this.voteItem);
        this.listenTo(actions.favouriteItem, this.favouriteItem);
        this.listenTo(actions.addQuery,      this.addQuery);
        this.listenTo(actions.removeQuery,   this.removeQuery);

        // get the data after the user logs in
        user.whenLogedIn(() => {

            postAction({
                group: 'auth',
                label: 'login'
            });

            getActions().then(result => {
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

    updatePoints: function (group, action) {

        var pointsToAdd = _.get(pointsForActions, [group, action], 0);

        this.state.alltime.user.points.all    += pointsToAdd;
        this.state.monthly.user.points.all    += pointsToAdd;

        // add to group object of alltime
        var points = _.get(this.state.alltime.user, ['actions', group, action], 0);
        _.set(this.state.alltime.user, ['actions', group, action], points + pointsToAdd);

        // add to group object of monthly
        points = _.get(this.state.monthly.user, ['actions', group, action], 0);
        _.set(this.state.monthly.user, ['actions', group, action], points + pointsToAdd);

        this.trigger(this.state);

    },

    addQuery: function (queryTerm, track) {
        // we do not want to track the queries that are added when the wall is started
        if (track) {
            owa.track('search', queryTerm, 'add');
            this.updatePoints('search', 'add');

            postAction({
                group: 'search',
                label: 'add',
                value: queryTerm
            });

        }
    },
    removeQuery: function (queryTerm) {
        owa.track('search', queryTerm, 'remove');
        this.updatePoints('search', 'remove');

        postAction({
            group: 'search',
            label: 'remove',
            value: queryTerm
        });
    },

    voteItem: function (uuid, value) {
        if (value > 0) {
            owa.track('vote', uuid, 'up');
            this.updatePoints('vote', 'up');

            postAction({
                group: 'vote',
                label: 'up',
                item: uuid,
                value: uuid
            });
        }

        if (value < 0) {
            owa.track('vote', uuid, 'down');
            this.updatePoints('vote', 'down');

            postAction({
                group: 'vote',
                label: 'down',
                item: uuid,
                value: value
            });
        }
    },

    favouriteItem: function (uuid) {
        owa.track('favourite', uuid, 'toggle');
        this.updatePoints('favourite', 'toggle');

        postAction({
            group: 'favourite',
            label: 'toggle',
            item: uuid,
            value: uuid
        });

    },

    addReward: function (id) {
        owa.track('reward', '', id);
    }

});
