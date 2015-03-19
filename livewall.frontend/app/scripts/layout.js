import _ from 'lodash';
import $ from 'jquery';
import {calculateColumns} from './utils.js';
import {dataStore} from './stores.js';

var sortFunction = function (a, b) {
    return -(a.get('score') - b.get('score'));
};

var Layout  = {
    items: {},
    layout: function () {
        console.log('layouting...');

        var chunks = _.range(calculateColumns()).map(i => { return []; });
        
        dataStore.items.forEach((_item, i) => {
            chunks[i % (chunks.length)].push(_item);
        });

        chunks = chunks.map( (chunk) => {
            chunk.sort(sortFunction);
            return chunk;
        });
        
        var margin = 14;
        // var width = margin;
        chunks.forEach((column, j) => {
            var height = 0;
            column.forEach((_item, i) => {

                var item = this.items[_item.get('uuid')];

                // check if css was already set
                if (item.topHeight !== height) {
                    $(item.dom).css({
                        transition: '0.5s',
                        position: 'absolute',
                        height: item.height,
                        width: item.width,
                        left: 0,
                        top: 0,
                        transform: 'translate(0px, ' + height + 'px )'
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