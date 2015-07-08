import _                from 'lodash';
import Reflux           from 'reflux';
import Immutable        from 'immutable';

import {compareStrings} from '../../shared/util/utils.js';
import actions          from '../actions/actions.js';
import dataStore        from './data.js';


var sortResolver = (a, b) => {
    var _a = (a.get('query') + a.get('uuid'));
    var _b = (b.get('query') + b.get('uuid'));

    return _a > _b ? 1 : -1;
};

export var sorters = {
    score: (a, b) => {
        var result = -(
            (a.get('score') + (a.get('votes') || 0)) -
            (b.get('score') + (b.get('votes') || 0))
        );
        if (result === 0) {
          return sortResolver(a, b);
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

export var groupers = {
    queryAdded: (items, numberOfColumns, sortFunction) => {
        var chunks = _.range(numberOfColumns).map(() => { return []; });

        items
        .toList()
        .groupBy((_item, i) => {
            return _item.get('query');
        })
        .entrySeq().sort((entryA, entryB) => {
            return entryA[0].date - entryB[0].date;
        })
        .map(entry => {
            return entry[1];
        })
        .toList()
        .forEach((_items, i) => {
            var index = i % numberOfColumns;
            chunks[index] = chunks[index].concat(_items.toArray());
        });

        var columns = chunks.map(chunk => {
            chunk.sort(sortFunction);
            return chunk;
        });

        return columns;
    },
    none: (items, numberOfColumns, sortFunction) => {

        var chunks = _.range(numberOfColumns).map(() => { return []; });

        items.toList().forEach((_item, i) => {
            var columnIndex = i % numberOfColumns;
            chunks[columnIndex].push(_item);
        });

        var columns = chunks.map( (chunk) => {
            chunk.sort(sortFunction);
            return chunk;
        });

        return columns;
    }
};

//
// LAYOUT STORE
//

export default Reflux.createStore({
    init: function () {

        this.items = Immutable.Map();
        // This will synchronize multiple search-results
        // Higher value will result in smoother experience, but it will take longer
        // to load
        this.debounceTime = 1500;
        this.debouncedLayout = _.debounce(() => this.layout(true), this.debounceTime);
        // needs to be synchronized with the css-variable
        this.margin = 8 * 2;
        this.sortFunction = sorters.score;
        this.groupFunction = groupers.none;

        this.calculateColumns();

        this.listenTo(dataStore,              this.onStoreChange);
        this.listenTo(actions.addDomElement,  this.addDomElement);
        this.listenTo(actions.changeSort,     this.changeSort);
        this.listenTo(actions.relayout, () => this.layout(false));

        this.queued = [];

    },
    getResizeCallback: function () {
        /* Animations cause weird behaviour with the resize event, it is not guarenteed that
           the height of the element is correctly calculated when the animations are on.
           A workaraund is to wait some time to call the relayout, but this is not reliable
           and the value is quite high like 600ms
        */
        return _.debounce(() => {
            var width = window.innerWidth;
            if (this.width === width) {
                return;
            }
            this.width = width;
            this.relayout(false);
        });
    },
    onStoreChange: function (items) {

        var temp = this.items;
        this.items = items.map((tile) => {

            var uuid = tile.get('uuid');
            var oldTile = this.items.get(uuid);

            var columnIndex = 0;
            var left = 0;

            var newTile;
            if (!oldTile) {

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
                var updatedTile = tile.updateIn(['position', 'left'], left, () => left);
                newTile = oldTile.merge(updatedTile);
            }

            return newTile

        });

        // instantly update
        // we only want to debounce when new items are added
        if (temp.count() >= this.items.count()) {
            this.layout(true);
        } else {
            this.debouncedLayout();
        }
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

            if (!item || !item.get('dom')) {
                return;
            }

            var newItem = item.merge({
                height: item.get('dom').offsetHeight,
                relayout: true
            });

            return newItem;
        });

        this.layout(transition);

    },

    layout: function (transition = true) {

        var columns = this.groupFunction(
            this.items.sort(this.sortFunction),
            this.numberOfColumns,
            this.sortFunction
        );

        columns.forEach((column, j) => {

            var top = 0;
            column.forEach((item, i) => {

                // if the element isn't mounted yet by react we skip it
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
    addDomElement: function (uuid, dom) {

        // This case only happens when we switch to another site and back to
        // the wall-site, we save some computation time with this
        //

        var item = this.items.get(uuid);

        if (!item) {
            return;
        }

        // this code can be used to optimize switching back to the wall,
        // but it is not reliable: resize events can change the size without
        // this function noticing

        // if (item.get('dom')) {
        //     item = item.set('dom', dom);
        //     this.items = this.items.set(uuid, item);
        //     return;
        // }

        var height = dom.offsetHeight;

        item = item.merge({
            dom: dom,
            height: height
        });

        this.items = this.items.set(uuid, item);
        // or requestanimationframe
        if (this.items.filter(x => x.get('dom')).count() === this.items.count()) {
            this.layout(true);
        }

    },
    changeSort: function(sort) {
        this.sortFunction = sorters[sort];
        this.layout();
    }
});
