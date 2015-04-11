'use strict';

import _ from 'lodash';
import Reflux from 'reflux';
import Immutable from 'immutable';
import jquery from 'jquery';

import {Reddit, PiaZentral, PiaHaus} from './agents.js';
import actions from './actions.js';
import {user} from './auth.js';
import {SETTINGS} from './settings.js';

export var dataStore = Reflux.createStore({

    init: function () {

        this.items = Immutable.List();

        this.cache = {};
        this.queries = {};

        this.profile = {
            queries: {},
            favourites: {}
        };

        this.availableSources = [
            PiaHaus,
            PiaZentral
        ];

        this.listenTo(actions.addItem, this.addItem);
        this.listenTo(actions.upvoteItem, this.upvoteItem);
        this.listenTo(actions.downvoteItem, this.downvoteItem);
        this.listenTo(actions.favouriteItem, this.favouriteItem);
        this.listenTo(actions.loadItems, this.loadItems);

        this.listenTo(actions.addQuery, this.addQuery);
        this.listenTo(actions.removeQuery, this.removeQuery);

        SETTINGS.QUERIES.forEach(queryTerm => {
            var agents = this.availableSources.map(source => {
                var queryAgent = new source(queryTerm);
                return {
                    agent: queryAgent,
                    loaded: false,
                    polling: false,
                };
            })

            this.queries[queryTerm] = {
                loaded: false,
                agents: agents,
                name: queryTerm
            };

        });

    },

    getIndexByUUID: function (uuid) {
        return this.items.findIndex(item => item.get('uuid') === uuid);
    },

    addQuery: function (queryTerm) {

        if (this.queries[queryTerm]) {
            return;
        }


        var agents = this.availableSources.map(source => {

            var querieAgent = {
                agent: new source(queryTerm),
                loaded: false,
                polling: false
            };

            this.loadData(querieAgent);

            return querieAgent
        });

        this.queries[queryTerm] = {
            loaded: false,
            agents: agents,
            name: queryTerm
        };

        actions.changedQueries(this.queries);


    },
    removeQuery: function (queryTerm) {

        delete this.queries[queryTerm];

        this.items = this.items.filter((item) => {
            var result = item.get('query') !== queryTerm;
            // remove it from the cache
            if (!result) {
                delete this.cache[item.get('uuid')];
            }
            return result;
        });
        actions.changedQueries(this.queries);
        this.triggerState.bind(this)();
    },

    loadData: function (agent) {

        agent.loaded = false;
        actions.changedQueries(this.queries);

        var result = jquery.Deferred();
        try {
            result = agent.agent.getData(user).then(data => {

                data.data.forEach((d, i) => {

                    d.agent = agent.agent.key;
                    var dIm = Immutable.Map(d);

                    // append tile when image finishes loading
                    if (d.type === 'image') {
                        var img = new Image;
                        img.src = d.url;
                        img.onload = () => {
                            this.addItem(dIm);
                        };
                    } else {
                        this.addItem(dIm, false);
                    }
                });

                agent.loaded = true;
                actions.changedQueries(this.queries);
                this.triggerState.bind(this)();

            }).fail(() => {
                console.log('failed...');
                agent.loaded = false;
                agent.error = true;
                actions.changedQueries(this.queries);
            });
        } catch (e) {
            console.log('error while loading data.');
            console.error(e);
        }

        return result;
    },

    matchFavourites: function () {
            this.items = this.items.map((item) => {
                var uuid = item.get('uuid')
                if (this.profile.favourites[uuid]) {
                    item = item.set('favourite', true);
                }
                return item;
            });
    },

    loadProfile: function () {
        user.profile().then((result) => {
            this.profile.queries = result.queries;
            this.profile.favourites = result.favourites;
            this.triggerState();
        });
    },

    loadItems: function () {

        _.values(this.queries).forEach(query => {
            query.agents.forEach(this.loadData);
        });

        this.loadProfile();

        // polling
        // _.values(this.queries).forEach(s => {
        //     if (s.polling) {
        //         var callback = () => {
        //             console.log('polling...');
        //             this.loadData(s);
        //             setTimeout(function() {
        //                 callback();
        //             }, s.polling * 1000);
        //         };
        //
        //         setTimeout(function() {
        //             callback();
        //         }, s.polling * 1000);
        //
        //     }
        // });
    },

    reset: function () {
        this.items = Immutable.List();
        this.cache = {};
    },

    addItem: function (item, trigger = true) {

        var uuid = item.get('uuid');

        if (this.cache[uuid]) {
            var index = this.getIndexByUUID(uuid);
            this.items = this.items.set(index, item);
        } else {
            this.items = this.items.push(item);
        }

        this.cache[uuid] = item;

        if (trigger) {
            this.triggerState.bind(this)();
        }

    },

    removeItem: function (item) {
        var index = this.getIndexByUUID(item.get('uuid'));
        this.items = this.items.delete(index);
        delete this.cache[item.get('uuid')];
    },

    triggerState: function () {
        this.matchFavourites();
        this.trigger(this.items);
    },

    upvoteItem: function (item) {
        var index = this.getIndexByUUID(item.get('uuid'));
        item = item.update('score', x => { return x + 1; });
        this.items = this.items.set(index, item);
        this.triggerState.bind(this)(this.items);
    },

    downvoteItem: function (item) {
        var index = this.getIndexByUUID(item.get('uuid'));
        item = item.update('score', x => { return x - 1; });
        this.items = this.items.set(index, item);
        this.triggerState.bind(this)(this.items);
    },

    favouriteItem: function (item) {
        var index = this.getIndexByUUID(item.get('uuid'));
        var favourite = item.get('favourite');

        var successCallback = () => {
            var itemNew = item.set('favourite', !favourite);
            this.items = this.items.set(index, itemNew);
            this.loadProfile();
        };

        var failCallback = () => {
        };

        var fn = favourite ? 'unfavourite' : 'favourite';

        user[fn](item)
            .then(successCallback)
            .fail(failCallback);


    }

});
