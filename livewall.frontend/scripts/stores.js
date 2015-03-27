'use strict';

import _ from 'lodash';
import Reflux from 'reflux';
import Immutable from 'immutable';

import {Reddit, PiaZentral, PiaHaus} from './sources.js';
import actions from './actions.js';
import {user} from './auth.js';

export var dataStore = Reflux.createStore({

    init: function () {

        this.items = Immutable.List();

        this.cache = {};
        this.itemCounter = 0;

        this.sources = {};

        this.availableSources = [
            PiaHaus,
            PiaZentral,
            Reddit
        ];

        this.listenTo(actions.addItem, this.addItem);
        this.listenTo(actions.upvoteItem, this.upvoteItem);
        this.listenTo(actions.loadItems, this.loadItems);

        this.listenTo(actions.addSource, this.addSource);
        this.listenTo(actions.removeSource, this.removeSource);

        var source = new PiaZentral('dai labor');

        this.sources[source.key] = {
            source: source,
            polling: false
        };

        // source = new Reddit('politics');
        // this.sources[source.key] = {
        //     source: source,
        //     polling: false,
        //     loaded: false
        // };
        //
        // source = new Reddit('earthporn');
        // this.sources[source.key] = {
        //     source: source,
        //     polling: false
        // };
    },

    addSource: function (options) {

        var source = _.find(this.availableSources, s => {
            return s.name === options.source;
        });

        var sourceObject = {
            source: new source (options.search),
            polling: options.polling
        };


        this.sources[sourceObject.source.key] = sourceObject;
        actions.changedSources(this.sources);

        this.loadSource(sourceObject);

    },
    removeSource: function (source) {
        delete this.sources[source.key];
        this.items = this.items.filter((item) => {
            return item.get('source') !== source.key;
        });
        actions.changedSources(this.sources);
        this.triggerState.bind(this)();
    },

    loadSource: function (source) {

        source.loaded = false;
        actions.changedSources(this.sources);

        return source.source.getData(user).then(data => {

            data.data.forEach((d, i) => {

                d.source = source.source.key;

                // append tile when image finishes loading
                if (d.type === 'image') {
                    var img = new Image;
                    img.src = d.url;
                    img.onload = () => {
                        var dIm = Immutable.Map(d);
                        this.addItem(dIm);
                    };
                } else {
                    var dIm = Immutable.Map(d);
                    this.addItem(dIm, false);
                }
            });

            source.loaded = true;
            actions.changedSources(this.sources);
            this.triggerState.bind(this)();

        });
    },

    loadItems: function () {

        _.values(this.sources).forEach(s => {
            this.loadSource(s);
        });

        // polling
        _.values(this.sources).forEach(s => {
            if (s.polling) {
                var callback = () => {
                    console.log('polling...');
                    this.loadSource(s);
                    setTimeout(function() {
                        callback();
                    }, s.polling * 1000);
                };

                setTimeout(function() {
                    callback();
                }, s.polling * 1000);

            }
        })
    },

    reset: function () {
        this.items = Immutable.List();
        this.cache = {};
    },

    addItem: function (item, trigger = true) {

        var uuid = item.get('title') + item.get('content');
        item = item.set('uuid', uuid);

        if (this.cache[uuid]) {
            var itemCached = this.cache[uuid];
            var index = itemCached.get('i');
            item = item.set('i', index);
            this.items = this.items.set(index, item);
        } else {
            item = item.set('i', this.items.count());
            this.items = this.items.push(item);
        }

        this.cache[uuid] = item;
        if (trigger) {
            this.triggerState.bind(this)();
        }

        this.itemCounter++;
    },

    removeItem: function (item) {
        var index = item.get('i');
        this.items = this.items.splice(index, 1);
        delete this.cache[item.get('uuid')];
    },

    triggerState: function () {
        this.trigger(this.items);
    },

    upvoteItem: function (item) {
        item = item.update('score', x => { return x + 1 });
        this.items = this.items.set(item.get('i'), item);
        this.triggerState.bind(this)(this.items);
    }

});
