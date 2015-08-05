import React        from 'react/addons';
import Reflux       from 'reflux';
import Immutable    from 'immutable';

import layoutStore  from '../../stores/layout.js';

import actions      from '../../actions/actions.js';

import Tile         from './tiles.js';
import Queries      from './queries.js';

// used to fade the queries in and out
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

/**
 * This component will listen to the layoutStore and will create a tile for every
 * item in the emitted list.
 */
export default React.createClass({
    displayName: 'wall',

    mixins: [Reflux.connect(layoutStore, 'items')],

    componentDidMount: function() {
        // append the resize-listener to the DOM of the wall
        var dom = this.refs.wall.getDOMNode();
        this.resize = layoutStore.getResizeCallback();
        window.addEventListener('resize', this.resize);
        this.resize();
        actions.relayout();
    },

    componentWillUnmount: function () {
        // remove the resize listener
        window.removeEventListener('resize', this.resize);
    },

    /**
     * Create a spinning gear to symbolize loading.
     * @returns {Component} The loader
     */
    createLoader: function () {
        // only show loader when there are no items
        if (this.state.items.count() === 0) {
            return (
                <div className="wall__loader">
                    <i className="fa fa-gear fa-spin fa-5x"></i>
                </div>
            );
        }
    },

    /**
     * Create a tile for every item.
     * @returns {Component[]}
     */
    createTiles: function () {
        return this.state.items.toArray()
            // sanity-check to remove all tiles that are undefined
            .filter(t => t)
            // create the components
            .map((tile) => <Tile tile={tile} key={tile.get('uuid')}/>);
    },

    render: function () {
        return (
            <div ref='wall'>
                <Queries />
                <div className='tiles'>
                    <ReactCSSTransitionGroup
                        transitionName="fade"
                        transitionAppear={false}
                        transitionEnter={false}>
                        {this.createTiles()}
                    </ReactCSSTransitionGroup>
                    {this.createLoader()}
                    </div>
                </div>
            </div>
        );
    }
});
