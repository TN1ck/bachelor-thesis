import _ from 'lodash';
import $ from 'jquery';
import {calculateColumns} from './utils.js';
import {dataStore} from './stores.js';

var sortFunction = function (a, b) {
    return -(a.get('score') - b.get('score'));
};

var Layout  = {
    items: {},
    getColumns: function () {
        var chunks = _.range(calculateColumns(window.innerWidth)).map(i => { return []; });
        
        dataStore.items.forEach((_item, i) => {
            chunks[i % (chunks.length)].push(_item);
        });

        chunks = chunks.map( (chunk) => {
            chunk.sort(sortFunction);
            return chunk;
        });

        return chunks;
    },
    relayout: function () {
        console.log('relayout');
        _.values(this.items).forEach(function(item) {
            item.width = item.dom.offsetWidth;
            item.height = item.dom.offsetHeight;
        });

        this.layout();
    },
    layout: function () {
        var columns = this.getColumns(); 
        
        var margin = 14;
        // var width = margin;
        columns.forEach((column, j) => {
            var height = 0;
            column.forEach((_item, i) => {

                var item = this.items[_item.get('uuid')];

                if (!item) {
                    return;
                }

                // check if css was already set
                if (item.topHeight !== height) {
                    $(item.dom).css({
                        transform: 'translate3D(0, ' + height + 'px, 0)'
                        // top: height + 'px' // transform is faster
                    });
                    
                    item.topHeight = height;
                }

                height += item.height + margin;

            });
        });

    },
    addTile: function (dom, props) {
        var width = dom.offsetWidth;
        var height = dom.offsetHeight;
        this.items[props.get('uuid')] = {dom: dom, width: width, height: height};
    },
    removeTile: function(props) {
        delete this.items[props.get('uuid')];
    }
};

export default Layout;