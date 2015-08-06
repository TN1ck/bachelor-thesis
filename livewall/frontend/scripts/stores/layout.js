import _                from 'lodash';
import Reflux           from 'reflux';
import Immutable        from 'immutable';

import {compareStrings} from '../../shared/util/utils.js';
import actions          from '../actions/actions.js';
import dataStore        from './data.js';


/**
 * When the score of two items equals, this function will provide conistency
 * in sorting by comporing the associoted query and the uuid of the items
 *
 * @param {Object} a The first item
 * @param {Object} b The second item
 * @returns {Boolean} Is a *larger* than b
 */
function sortResolver (a, b) {
    var _a = (a.get('query') + a.get('uuid'));
    var _b = (b.get('query') + b.get('uuid'));

    return _a > _b ? 1 : -1;
}

/**
 * Possible sorters that can be used. Currently only the score-sorter can be used
 * by the user.
 */
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

/**
 * To optimize the flow of the tiles, different groupers can be used. Every grouper
 * will specifiy which items will be in which column.
 */
export var groupers = {
    /**
     * Group the items by the time the query was added
     * @param {Object[]} items The items that will be grouped
     * @param {Number} numberOfColumns The number of columns
     * @param {Function} The function that will provide the inner-column sorting
     * @returns {Object[][]} The grouped items
     */
    queryAdded: (items, numberOfColumns, sortFunction) => {
        var chunks = _.range(numberOfColumns).map(() => { return []; });

        items
        .toList()
        .groupBy((_item) => {
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
    /**
     * Group the items by nothing, will yield the most intuitive version in
     * terms of item-sorting
     * @param {Object[]} items The items that will be grouped
     * @param {Number} numberOfColumns The number of columns
     * @param {Function} The function that will provide the inner-column sorting
     * @returns {Object[][]} The grouped items
     */
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

/**
 * The Layoutstore will handle everything related to the layouting of the items.
 */
export default Reflux.createStore({

    /**
     * Initialization of the Layoutstore, will set the inital state and create
     * listeners
     */
    init: function () {

        this.items = Immutable.Map();

        // This will synchronize multiple query-results
        // Higher value will result in smoother experience, but it will take longer
        // to load
        this.debounceTime = 1500;
        this.debouncedLayout = _.debounce(() => this.layout(true), this.debounceTime);

        // needs to be synchronized with the css-variable
        this.margin = 8 * 2;

        // used sort and group function
        this.sortFunction = sorters.score;
        this.groupFunction = groupers.none;

        // initial calculation of columns
        this.calculateColumns();

        this.listenTo(dataStore,              this.onStoreChange);
        this.listenTo(actions.addDomElement,  this.addDomElement);
        this.listenTo(actions.changeSort,     this.changeSort);
        this.listenTo(actions.relayout, () => this.layout(false));

        this.queued = [];

    },

    /**
     * Returns the state of the store
     * @returns the state
     */
    getInitialState: function () {
        return this.items;
    },

    /**
     * Creates the resize-callback
     * @returns {Function} The Function that should be called when the window resizes
     */
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
        }, 50);
    },

    /**
     * Synchronizes the given list of items with its current list of items
     *
     * @param {Object[]} items The new list of items from the datastore
     */
    onStoreChange: function (items) {

        var temp = this.items;
        this.items = items.map((tile) => {

            var uuid = tile.get('uuid');
            var oldTile = this.items.get(uuid);

            var columnIndex = 0;
            var left = 0;

            var newTile;
            if (!oldTile) {

                var translate = `translate3D(${left}px , 0px, 0)`;
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

            return newTile;

        });

        // instantly update
        // we only want to debounce when new items are added
        if (temp.count() >= this.items.count()) {
            this.layout(true);
        } else {
            this.debouncedLayout();
        }
    },

    /**
     * Calculate the number of columns and their width
     *
     * @returns {{columns: Number, width; Number}} The number of columns and the width
     */
    calculateColumns: function () {

        var width = window.innerWidth;

        // needs to be synchronized with the CSS-media-queries
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

    /**
     * Recalculate the height of every element and layout them again
     *
     * @param {Boolean} transition Specify if transitions should be active
     */
    relayout: function (transition = true) {

        this.calculateColumns();

        this.items = this.items
            .filter(item => item && !item.get('dom'))
            .map((item) => {
                return item.set('height', item.get('dom').offsetHeight);
            });

        this.layout(transition);

    },

    /**
     * Layout the items. This does not compute the height again, use `relayout
     * when you need to.
     *
     * @param {Boolean} transition Specify if transitions should be active
     */
    layout: function (transition = true) {

        // calculate columns using the groupFunction and the sortFunction
        var columns = this.groupFunction(
            this.items.sort(this.sortFunction),
            this.numberOfColumns,
            this.sortFunction
        );

        // iterate over each column and calculate the position of each
        columns.forEach((column, j) => {

            // top specifies the y-coordinate of an item
            var top = 0;

            // calculate the position for every item
            column.forEach((item) => {

                // if the element isn't mounted yet by react we skip it
                if (!item.get('dom')) {
                    return;
                }

                // calculate the left offset of the item
                var left = (this.columnWidth + this.margin) * j + this.margin / 2;

                /* round width and height so that everythig is pixel-perfect
                   this is normally not important, but in combination
                   with translate3D it can lead to blurry elements
                */
                var translate = `translate3D(${Math.round(left)}px, ${Math.round(top)}px, 0)`;

                var css = {
                    transform: translate,
                    '-webkit-transform': translate,
                    opacity: 1
                };

                /* when transitions are turned off, we only animate the opacity,
                   this is only really needed for window-resizing
                */
                var cssClass = transition ? 'animate-opacity-transform' : 'animate-opacity';

                // update the tile with its new position
                item = item.merge({
                    class: cssClass,
                    css: css,
                    position: Immutable.Map({
                        left: left,
                        top: top,
                        column: j
                    })
                });

                this.items = this.items.set(item.get('uuid'), item);

                // update the top value
                top += item.get('height') + this.margin;

            });

        });

        this.trigger(this.items);

    },

    /**
     * Adds the given DOM-node to the item with the given uuid
     *
     * @param {String} uuid The uuid of the item
     * @param {Node} dom The DOM-node of the item
     */
    addDomElement: function (uuid, dom) {

        /* This case only happens when we switch to another site and back to
           the wall-site, we save some computation time with this
        */
        var item = this.items.get(uuid);

        if (!item) {
            return;
        }

        /* this code optimizes switching back to the wall
        */
        if (item.get('dom')) {
            item = item.set('dom', dom);
            this.items = this.items.set(uuid, item);
            return;
        }

        // these values will specify where the item will start its animation
        var columnIndex = 0;
        var left = 0;

        // calculate the height of the item
        var height = dom.offsetHeight;

        // create initial CSS
        var translate = `translate3D(${left}px , 0px, 0)`;
        var css = {
            transform: translate,
            '-webkit-transform': translate
        };
        var cssClass = 'animate-opacity';

        // update the tile with its DOM-node and its height
        item = item.merge({
            dom: dom,
            height: height,
            position: Immutable.Map({
                left: left,
                top: 0,
                column: columnIndex
            }),
            css: css,
            class: cssClass
        });

        this.items = this.items.set(uuid, item);

        // only layout when all items have a DOM-attribute
        if (this.items.filter(x => x.get('dom')).count() === this.items.count()) {
            this.layout(true);
        }

    },

    /**
     * Change the sortFunction, not used at the moment
     */
    changeSort: function(sort) {
        this.sortFunction = sorters[sort];
        this.layout();
    }
});
