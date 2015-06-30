import _                  from 'lodash';
import Reflux             from 'reflux';
import Immutable          from 'immutable';
import $                  from 'jquery';
import moment             from 'moment';

import actions            from '../actions/actions.js';
import {user}             from '../auth.js';
import {SETTINGS}         from '../settings.js';
import * as owa           from '../owa.js';
import * as leaderboard   from '../aggregate/leaderboard.js';
import {pointsForActions} from '../gamification/points.js';

//
// GAME STORE
//

export default Reflux.createStore({

    init: function () {

        this.items = Immutable.OrderedMap();

        this.listenTo(actions.voteItem,      this.voteItem);
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
            leaderboard.getMonthlyLeaderBoard().then(result => {
                this.state.monthly = result;
                this.trigger(this.state);
            });
            leaderboard.getAllTimeLeaderBoard().then(result => {
                this.state.alltime = result;
                this.trigger(this.state);
            });
        });

    },

    getInitialState: function () {
        return this.state;
    },

    updatePoints: function (group, action) {
        var pointsAdded = pointsForActions[group][action];
        this.state.alltime.user.trophies.points.all    += pointsAdded;
        this.state.alltime.user.trophies.points[group] += pointsAdded;
        this.state.monthly.user.trophies.points.all    += pointsAdded;
        this.state.monthly.user.trophies.points[group] += pointsAdded;
        this.trigger(this.state);
    },

    addQuery: function (queryTerm, track) {
        // we do not want to track the queries that are added when the wall is started
        if (track) {
            owa.track('search', queryTerm, 'add');
            this.updatePoints('search', 'add');

            $.post(`${SETTINGS.SERVER_URL}/api/user/action`, {

                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                username: user.username,
                group: 'search',
                label: 'add',
                value: queryTerm

            });

        }
    },
    removeQuery: function (queryTerm) {
        owa.track('search', queryTerm, 'remove');
        this.updatePoints('search', 'remove');

        $.post(`${SETTINGS.SERVER_URL}/api/user/action`, {

            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            group: 'search',
            label: 'remove',
            username: user.username,
            value: queryTerm

        });
    },

    voteItem: function (uuid, value) {
        if (value > 0) {
            owa.track('vote', uuid, 'up');
            this.updatePoints('vote', 'up');

            $.post(`${SETTINGS.SERVER_URL}/api/user/action`, {

                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                group: 'vote',
                label: 'up',
                item: uuid,
                username: user.username,
                value: value

            })
        }

        if (value < 0) {
            owa.track('vote', uuid, 'down');
            this.updatePoints('vote', 'down');

            $.post(`${SETTINGS.SERVER_URL}/api/user/action`, {

                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                group: 'vote',
                label: 'down',
                item: uuid,
                username: user.username,
                value: value

            })
        }
    },

    favouriteItem: function (uuid) {
        owa.track('favourite', uuid, 'toggle');
        this.updatePoints('favourite', 'toggle');

        $.post(`${SETTINGS.SERVER_URL}/api/user/action`, {

            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            group: 'favourite',
            label: 'toggle',
            username: user.username,
            item: uuid,
            value: uuid

        })

    },

    addReward: function (id) {
        owa.track('reward', '', id);
    }

});
