'use strict';

import _ from 'lodash';
import Reflux from 'reflux';
import Immutable from 'immutable';
import {dataStore} from './data.js';
import actions from '../actions.js';
import {compareStrings} from '../utils.js';

export var layoutStore  = Reflux.createStore({
    init: function () {
        this.items = Immutable.OrderedMap();
        this.margin = 8 * 2;
        this.sortFunctions = {
            score: (a, b) => {
                var result = -(a.get('score') - b.get('score'));
                if (result === 0) {
                  result = a.get('uuid') > b.get('uuid') ? 1 : -1;
                }
                return result;
            },
            created: (a, b) => {
                return compareStrings(a.get('created'), b.get('created'));
            },
            domain: (a, b) => {
                return compareStrings(a.get('domain'), b.get('domain'));
            },
            query: (a, b) => {
                return compareStrings(a.get('query'), b.get('query'));
            },
            type: (a, b) => {
                return compareStrings(a.get('type'), b.get('type'));
            }
        };

        this.sortFunction = this.sortFunctions.score;
        
        this.calculateColumns();
        
        this.listenTo(dataStore, this.onStoreChange);
        this.listenTo(actions.addDomElement, this.addDomElement);
        this.listenTo(actions.changeSort, this.changeSort);

        var resizeCallback;

        window.addEventListener('resize', () => {

            var width = window.innerWidth;

            if (this.width === width) {
                return;
            }

            this.width = width;
            clearTimeout(resizeCallback);

            resizeCallback = setTimeout(() => {
                /* Animations cause weird behaviour with the resize event, it is not guarenteed that
                   the height of the element is correctly calculated when the animations are on.
                   A workaraund is to wait some time to call the relayout, but this is not reliable
                   and the value is quite high like 600ms
                */
                this.relayout(false);
                resizeCallback = false;
            }, 100);

        });

    },
    onStoreChange: function (items) {

        this.items = items.map((tile) => {
            
            var uuid = tile.get('uuid');
            var oldTile = this.items.get(uuid);

            var newTile;
            if (!oldTile) {

                var columnIndex = dataStore.items.toArray().indexOf(tile) % this.numberOfColumns;
                var left = (this.columnWidth + this.margin) * columnIndex + this.margin / 2;
                
                var translate = `translate3D(${left}px , 0px, 0)` 
                var css = {
                    transform: translate,
                    '-webkit-transform': translate
                };
                var cssClass = 'animate-opacity';

                newTile = tile.merge({
                    position: Immutable.Map({
                        left: left,
                        top: 0,
                        column: columnIndex 
                    }),
                    relayout: true,
                    css: css,
                    class: cssClass
                });

            } else {
                newTile = oldTile.merge(tile);
            }
            
            return newTile

        });
        
        console.log('layout trigger');
        this.layout(true);
    },
    calculateColumns: function () {

        var width = window.innerWidth;

        var screens = {
            large: 1200,
            desktop: 992,
            tablet: 768,
            phone: 480
        };

        var columns = 1;

        if (width > screens.large) {
            columns = 5;
        } else if (width > screens.desktop) {
            columns = 5;
        } else if (width > screens.tablet) {
            columns = 4;
        } else if (width > screens.phone) {
            columns = 2;
        }

        var columnWidth = (width - this.margin) / columns - this.margin;

        this.columnWidth = columnWidth;
        this.numberOfColumns = columns;

        return {
            columns: columns,
            width: columnWidth
        };

    },
    relayout: function (transition = true) {

        this.calculateColumns();

        this.items = this.items.map((item) => {
            var newItem = item.merge({
                height: item.get('dom').offsetHeight,
                relayout: true
            });

            return newItem;
        });

        this.layout(transition);

    },
    group: function (items) {

        var chunks = _.range(this.numberOfColumns).map(() => { return []; });

        items.toList().forEach((_item, i) => {
            var columnIndex = i % this.numberOfColumns;
            chunks[columnIndex].push(_item);
        });

        var columns = chunks.map( (chunk) => {
            chunk.sort(this.sortFunction);
            return chunk;
        });

        return columns;
    },

    layout: function (transition = true) {

        var columns = this.group(this.items);

        columns.forEach((column, j) => {

            var top = 0;
            column.forEach((item, i) => {

                if (!item.get('dom')) {
                    return;
                }

                var left = (this.columnWidth + this.margin) * j + this.margin / 2;
                // round width and height so that everythig is pixel-perfect
                // this is normally not important, but in combination with translate3D it can lead to blurry elements
                var translate = `translate3D(${Math.round(left)}px, ${Math.round(top)}px, 0)`;
                
                var css = {
                    transform: translate,
                    '-webkit-transform': translate,
                    opacity: 1
                };

                var cssClass = transition ? 'animate-opacity-transform' : 'animate-opacity';

                item = item.merge({
                    class: cssClass,
                    css: css,
                    position: Immutable.Map({
                        left: left,
                        top: top,
                        column: j
                    }),
                    relayout: false
                });
                
                this.items = this.items.set(item.get('uuid'), item);

                top += item.get('height') + this.margin;

            });

        });

        this.trigger(this.items);

    },
    addDomElement: function (tile, dom) {
        var height = dom.offsetHeight;

        var uuid = tile.get('uuid');
        var tile = this.items.get(uuid).merge({
            dom: dom,
            height: height
        });

        this.items = this.items.set(uuid, tile);

        this.layout(true);

    },
    changeSort: function(sort) {
        this.sortFunction = this.sortFunctions[sort];
        this.relayout();
    }
});
