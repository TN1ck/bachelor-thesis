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
        this.searches = {};

        this.availableSources = [
            PiaHaus,
            PiaZentral,
            Reddit
        ];

        this.listenTo(actions.addItem, this.addItem);
        this.listenTo(actions.upvoteItem, this.upvoteItem);
        this.listenTo(actions.downvoteItem, this.downvoteItem);
        this.listenTo(actions.favouriteItem, this.favouriteItem);
        this.listenTo(actions.loadItems, this.loadItems);

        this.listenTo(actions.addSearch, this.addSearch);
        this.listenTo(actions.removeSearch, this.removeSearch);

        SETTINGS.SEARCHES.forEach(searchTerm => {
            var agents = this.availableSources.map(source => {
                var searchAgent = new source(searchTerm);
                return {
                    agent: searchAgent,
                    loaded: false,
                    polling: false,
                };
            })

            this.searches[searchTerm] = {
                loaded: false,
                agents: agents,
                name: searchTerm
            };

        });

    },

    addSearch: function (searchTerm) {

        if (this.searches[searchTerm]) {
            return;
        }


        var agents = this.availableSources.map(source => {

            var searchAgent = {
                agent: new source(searchTerm),
                loaded: false,
                polling: false
            };

            this.loadData(searchAgent);

            return searchAgent
        });

        this.searches[searchTerm] = {
            loaded: false,
            agents: agents,
            name: searchTerm
        };

        actions.changedSearches(this.searches);


    },
    removeSearch: function (searchTerm) {

        delete this.searches[searchTerm];

        this.items = this.items.filter((item) => {
            var result = item.get('search') !== searchTerm;
            // remove it from the cache
            if (!result) {
                delete this.cache[item.get('uuid')];
            }
            return result;
        });
        actions.changedSearches(this.searches);
        this.triggerState.bind(this)();
    },

    loadData: function (agent) {

        agent.loaded = false;
        actions.changedSearches(this.searches);

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
                actions.changedSearches(this.searches);
                this.triggerState.bind(this)();

            }).fail(() => {
                console.log('failed...');
                agent.loaded = false;
                agent.error = true;
                actions.changedSearches(this.searches);
            });
        } catch (e) {
            console.log('error while loading data.');
            console.error(e);
        }

        return result;
    },

    loadItems: function () {

        _.values(this.searches).forEach(search => {
            search.agents.forEach(this.loadData);
        });

        // polling
        // _.values(this.searches).forEach(s => {
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
            var index = this.items.findIndex(item => item.get('uuid') === uuid);
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
        var index = this.items.indexOf(item);
        this.items = this.items.delete(index);
        delete this.cache[item.get('uuid')];
    },

    triggerState: function () {
        this.trigger(this.items);
    },

    upvoteItem: function (item) {
        var index = this.items.indexOf(item);
        item = item.update('score', x => { return x + 1; });
        this.items = this.items.set(index, item);
        this.triggerState.bind(this)(this.items);
    },

    downvoteItem: function (item) {
        var index = this.items.indexOf(item);
        item = item.update('score', x => { return x - 1; });
        this.items = this.items.set(index, item);
        this.triggerState.bind(this)(this.items);
    },

    favouriteItem: function (item) {
        var index = this.items.indexOf(item);

        item = item.update('favourite', x => { return !x; });
        this.items = this.items.set(index, item);
        this.triggerState.bind(this)(this.items);
    }

});
