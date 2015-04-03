'use strict';

import _ from 'lodash';
import $ from 'jquery';
import Immutable from 'immutable';
import {dataStore} from './stores.js';


var Layout  = {

    items: {},
    margin: 8 * 2, // needs to be the same value as in styles/components/tiles.less
    sortFunction: function (a, b) {
        var result = -(a.get('score') - b.get('score'));
        if (result === 0) {
          result = a.get('uuid') > b.get('uuid') ? 1 : -1;
        }
        return result;
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

        return {
            columns: columns,
            width: columnWidth
        };

    },
    relayout: function () {
        console.log('relayout');

        var {width: columnWidth, columns: numberOfColumns} = this.calculateColumns();
        this.columnWidth = columnWidth;
        this.numberOfColumns = numberOfColumns;

        _.values(this.items).forEach(function(item) {
            item.height = item.dom.offsetHeight;
            item.relayout = true;
        });
        this.layout();

    },
    group: function (items) {

        var chunks = _.range(this.numberOfColumns).map(() => { return []; });

        items.forEach((_item, i) => {
            var columnIndex = i % this.numberOfColumns;
            chunks[columnIndex].push(_item);
        });

        var columns = chunks.map( (chunk) => {
            chunk.sort(this.sortFunction);
            return chunk;
        });

        return columns;
    },

    layout: function (transition = true, dom = true) {

        console.log('layouting...' + (dom ? '' : ' without touching the dom'), transition);

        var columns = this.group(dataStore.items);

        var left = this.margin / 2;
        columns.forEach((column, j) => {

            var top = 0;
            column.forEach((_item, i) => {

                var item = this.items[_item.get('uuid')];

                if (!item) {
                    return;
                }

                // check if css was already set
                if (item.position.top !== top || item.relayout || item.position.column !== j) {

                    // round width and height so that everythig is pixel-perfect
                    // this is normally not important, but in combination with translate3D it can lead to blurry elements
                    var translate = 'translate3D( ' + Math.round(left) +  'px , ' + Math.round(top) + 'px, 0)';
                    var css = {
                        transform: translate,
                        '-webkit-transform': translate,
                        opacity: 1
                    };

                    item.class = transition ? 'animate-opacity-transform' : 'animate-opacity';
                    item.css = css;

                    item.position = {
                        left: left,
                        top: top,
                        column: j
                    };
                    item.relayout = false;

                    if (dom) {
                        item.$dom.css(css);
                        item.$dom.removeClass('animate-opacity').removeClass('animate-opacity-transform').addClass(item.class);
                    }
                }

                top += item.height + this.margin;

            });

            left += this.columnWidth + this.margin;

        });

    },
    getLeftOffset: function (tile) {
        var columnIndex = dataStore.items.indexOf(tile) % this.numberOfColumns;
        return (this.columnWidth + this.margin) * columnIndex + this.margin / 2;
    },
    getStyle: function (tile) {

        var item = this.items[tile.get('uuid')];
        var css;
        var cssClass;

        if (!item) {
            var leftOffset = this.getLeftOffset(tile);
            css = {
                transform: 'translate3D( ' + leftOffset +  'px , 0px, 0)',
                '-webkit-transform': 'translate3D( ' + leftOffset +  'px , 0px, 0)'
            };
            cssClass = 'animate-opacity';
        } else {
            css = item.css;
            cssClass = item.class;
        }

        return {
            css: css,
            class: cssClass
        }
    },
    addTile: function (dom, props) {
        var height = dom.offsetHeight;
        this.items[props.get('uuid')] = {dom: dom, $dom: $(dom), height: height, position: {top: 0, left: 0, column: -1}};
    },
    removeTile: function(props) {
        delete this.items[props.get('uuid')];
    }
};

var {width: columnWidth, columns: numberOfColumns} = Layout.calculateColumns();

Layout.columnWidth = columnWidth;
Layout.numberOfColumns = numberOfColumns;

var resizeCallback;

window.addEventListener('resize', () => {

    var width = window.innerWidth;

    if (Layout.width === width) {
        return;
    }

    Layout.width = width;
    clearTimeout(resizeCallback);

    resizeCallback = setTimeout(() => {
        Layout.relayout();
        resizeCallback = false;
    }, 600);

});

export default Layout;
