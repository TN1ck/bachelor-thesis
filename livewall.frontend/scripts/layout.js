import _ from 'lodash';
import $ from 'jquery';
import {dataStore} from './stores.js';


var Layout  = {

    items: {},
    margin: 14,
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
        }

        var columns = 1;

        if (width > screens.large) {
            columns = 4;
        } else if (width > screens.desktop) {
            columns = 4;
        } else if (width > screens.tablet) {
            columns = 3;
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
    layout: function (transition = true) {

        console.log('layouting...', transition);

        var chunks = _.range(this.numberOfColumns).map(i => { return []; });

        dataStore.items.forEach((_item, i) => {
            var columnIndex = i % this.numberOfColumns;
            chunks[columnIndex].push(_item);

        });

        var columns = chunks.map( (chunk) => {
            chunk.sort(this.sortFunction);
            return chunk;
        });

        var width = 0;
        columns.forEach((column, j) => {
            var height = 0;
            var lastItem;
            column.forEach((_item, i) => {

                var item = this.items[_item.get('uuid')];

                if (!item) {
                    return;
                }


                // check if css was already set
                if (item.topHeight !== height || item.relayout) {

                    var css = {
                        // round width and height so that everythig is pixel-perfect
                        // this is normally not important, but in combination with translate3D it can lead to blurry elements
                        transform: 'translate3D( ' + Math.round(width) +  'px , ' + Math.round(height) + 'px, 0)',
                        opacity: 1
                    };

                    if (!transition) {
                        item.$dom.addClass('animate-opacity').removeClass('animate-opacity-transform');
                    } else {
                        item.$dom.addClass('animate-opacity-transform').removeClass('animate-opacity');
                    }

                    item.$dom.css(css);

                    item.topHeight = height;
                    item.width = width;
                    item.relayout = false;
                }

                height += item.height + this.margin;
                lastItem = item;

            });

            width += this.columnWidth + this.margin;

        });

    },
    getLeftOffset: function (tile) {
        var columnIndex = dataStore.items.indexOf(tile) % this.numberOfColumns;
        return (this.columnWidth + this.margin) * columnIndex;
    },
    getStyle: function (tile) {
        var item = this.items[tile.get('uuid')];
        if (!item) {
            var leftOffset = this.getLeftOffset(tile);
            return {
                transform: 'translate3D( ' + leftOffset +  'px , 0px, 0)',
                // transform: '-webkit-translate3D( ' + leftOffset +  'px , 0px, 0)'
            };
        } else {
            return {
                transform: 'translate3D( ' + Math.round(item.width) + ',' + Math.round(item.topHeight) + 'px, 0)',
                opacity: 1
            };
        }
    },
    addTile: function (dom, props) {
        var height = dom.offsetHeight;
        this.items[props.get('uuid')] = {dom: dom, $dom: $(dom), height: height};
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
