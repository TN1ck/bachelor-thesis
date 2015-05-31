'use strict';

import _ from 'lodash';
import Reflux from 'reflux';
import Immutable from 'immutable';
import jquery from 'jquery';

import {Reddit, PiaZentral, PiaHaus} from '../agents.js';
import actions from '../actions.js';
import {user} from '../auth.js';
import {SETTINGS} from '../settings.js';
import {colorStore} from './color.js';

export var dataStore = Reflux.createStore({

    init: function () {

        this.items = Immutable.OrderedMap();

        this.queries = {};

        this.profile = {
            queries: {},
            favourites: {}
        };

        this.availableSources = [
            PiaHaus,
            PiaZentral
        ];

        this.listenTo(actions.upvoteItem, this.upvoteItem);
        this.listenTo(actions.downvoteItem, this.downvoteItem);
        this.listenTo(actions.favouriteItem, this.favouriteItem);
        this.listenTo(actions.loadItems, this.loadItems);

        this.listenTo(actions.addQuery, this.addQuery);
        this.listenTo(actions.removeQuery, this.removeQuery);
        this.listenTo(colorStore, this.colorStoreUpdate);

        // do not track these
        SETTINGS.QUERIES.forEach(queryTerm => actions.addQuery(queryTerm, false, false));

    },

    colorStoreUpdate: function (colors) {
        this.items.map((item) => {
            var itemNew = item.set('color', colors.get(item.get('query')));
            return itemNew;
        });
    },

    getIndexByUUID: function (uuid) {
        return this.items.findIndex(item => item.get('uuid') === uuid);
    },

    addQuery: function (queryTerm, loadData) {

        if (this.queries[queryTerm]) {
            return;
        }


        var agents = this.availableSources.map(source => {

            var querieAgent = {
                agent: new source(queryTerm),
                loaded: false,
                polling: false
            };

            if (loadData) {
                this.loadData(querieAgent);
            }

            return querieAgent;

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

    filterItem: function (item) {
        return _.some(SETTINGS.FILTER, (v, k) => {
            return _.some(v, (filter) => {
                var contentToBeFiltered = JSON.stringify(item.get(k));
                return contentToBeFiltered.toLowerCase().indexOf(filter.toLowerCase()) > -1;
            })
        })
    },

    loadItems: function () {

        _.values(this.queries).forEach(query => {
            query.agents.forEach((agent) => {
                if (!agent.loaded) {
                    this.loadData(agent);
                }
            });
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
        this.items = Immutable.OrderedMap();
    },

    addItem: function (item, trigger = true) {

        if (this.filterItem(item)) {
            console.log('filtered item ', item.toJS());
            return;
        }

        // set color
        item = item.set('color', colorStore.getColor(item.get('query')));

        var uuid = item.get('uuid');
        this.items = this.items.set(uuid, item);

        if (trigger) {
            this.triggerState.bind(this)();
        }

    },

    removeItem: function (item) {
        var uuid = item.get('uuid');
        this.items = this.items.delete(uuid);
    },

    triggerState: function () {
        this.matchFavourites();
        this.trigger(this.items);
    },

    upvoteItem: function (uuid) {
        var item = this.items.get(uuid).update('score', x => { return x + 1; });
        this.items = this.items.set(item.get('uuid'), item);
        this.triggerState.bind(this)(this.items);
    },

    downvoteItem: function (uuid) {
        var item = this.items.get(uuid).update('score', x => { return x - 1; });
        this.items = this.items.set(item.get('uuid'), item);
        this.triggerState.bind(this)(this.items);
    },

    favouriteItem: function (uuid) {
        var item = this.items.get(uuid);
        var favourite = item.get('favourite');

        var successCallback = () => {
            var itemNew = item.set('favourite', !favourite);
            this.items = this.items.set(item.get('uuid'), itemNew);
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
