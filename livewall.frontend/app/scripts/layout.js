import _ from 'lodash';
import $ from 'jquery';
import {dataStore} from './stores.js';


var Layout  = {
    
    items: {},
    margin: 14,
    sortFunction: function (a, b) {
        return -(a.get('score') - b.get('score'));
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
                        transform: 'translate( ' + width +  'px , ' + height + 'px)',
                        opacity: 1
                    };

                    if (!transition) {
                        css['transition-property'] = 'opacity';
                    } else {
                        // jquery needs the ','
                        css['transition-property'] = 'transform, opacity';
                    }

                    $(item.dom).css(css);
                    
                    item.topHeight = height;
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
    addTile: function (dom, props) {
        var height = dom.offsetHeight;
        this.items[props.get('uuid')] = {dom: dom, height: height};
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
    
    if (resizeCallback) {
        clearTimeout(resizeCallback);    
    }

    resizeCallback = setTimeout(() => {
        Layout.width = width;
        Layout.relayout();
        resizeCallback = false;
    }, 200);

});

export default Layout;