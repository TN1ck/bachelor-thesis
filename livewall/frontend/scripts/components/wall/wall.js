import React        from 'react/addons';
import Reflux       from 'reflux';
import Immutable    from 'immutable';

import layoutStore  from '../../stores/layout.js';

import actions      from '../../actions/actions.js';

import Tile         from './tiles.js';
import Queries      from './queries.js';

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

export default React.createClass({
    displayName: 'wall',
    mixins: [
        Reflux.connect(layoutStore, 'items')
    ],
    componentDidMount: function() {
        var dom = this.refs.wall.getDOMNode();
        this.resize = layoutStore.getResizeCallback();
        window.addEventListener('resize', this.resize);
        this.resize();
        actions.relayout();
    },
    componentWillUnmount: function () {
        window.removeEventListener('resize', this.resize);
    },
    createLoader: function () {
        if (this.state.items.count() === 0) {
            return <i className="fa fa-gear fa-spin fa-5x"></i>;
        }
    },
    createTiles: function () {
        return this.state.items.toArray().map((tile) => {
            if (tile) {
                return <Tile tile={tile} key={tile.get('uuid')}/>;
            }
        });
    },
    render: function () {
        return (
            <div ref='wall'>
                <Queries />
                <div className='tiles'>
                    <ReactCSSTransitionGroup transitionName="fade" transitionAppear={false} transitionEnter={false}>
                        {this.createTiles()}
                    </ReactCSSTransitionGroup>
                    <div className="wall__loader">
                        {this.createLoader()}
                    </div>
                </div>
            </div>
        );
    }
});
