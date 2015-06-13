import _                  from 'lodash';
import Reflux             from 'reflux';
import Immutable          from 'immutable';
import jquery             from 'jquery';
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

    addQuery: function (queryTerm, track) {
        // we do not want to track the queries that are added when the wall is started
        if (track) {
            owa.track('search', queryTerm, 'add');
            this.state.alltime.user.trophies.points.all += pointsForActions.search.add;
            this.trigger(this.state);
        }
    },
    removeQuery: function (queryTerm) {
        owa.track('search', queryTerm, 'remove');
        this.state.alltime.user.trophies.points.all += pointsForActions.search.remove;
        this.trigger(this.state);
    },

    upvoteItem: function (uuid) {
        owa.track('vote', uuid, 'up');
        this.state.alltime.user.trophies.points.all += pointsForActions.vote.up;
        this.trigger(this.state);
    },

    downvoteItem: function (uuid) {
        owa.track('vote', uuid, 'down');
        this.state.alltime.user.trophies.points.all += pointsForActions.vote.down;
        this.trigger(this.state);
    },

    favouriteItem: function (uuid) {
        owa.track('favourite', uuid, 'toggle');
        this.state.alltime.user.trophies.points.all += pointsForActions.favourite.toggle;
        this.trigger(this.state);
    },

    addReward: function (id) {
        owa.track('reward', '', id);
    }

});
