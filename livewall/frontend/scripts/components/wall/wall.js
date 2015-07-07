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
        Reflux.listenTo(layoutStore, "onStoreChange")
    ],
    onStoreChange: function(items) {
        this.setState({items: items});
    },
    getInitialState: function () {
        return {
            items: layoutStore.items,
            loading: true
        }
    },
    componentDidMount: function() {
        var dom = this.refs.wall.getDOMNode();
        this.resize = layoutStore.getResizeCallback();
        window.addEventListener('resize', this.resize);
        actions.relayout();
    },
    componentWillUnmount: function () {
        window.removeEventListener('resize', this.resize);
    },
    render: function () {

        var tiles = this.state.items.toArray().map((tile) => {
            if (tile) {
                return <Tile tile={tile} key={tile.get('uuid')}/>;
            }
        });

        var loading;
        if (tiles.length === 0) {
            loading = <i className="fa fa-gear fa-spin white fa-5x"></i>;
        }

        return (
            <div ref='wall'>
                <Queries />
                <div className='tiles'>
                    <ReactCSSTransitionGroup transitionName="fade" transitionAppear={false} transitionEnter={false}>
                        {tiles}
                    </ReactCSSTransitionGroup>
                    <div className="wall__loader">
                        {loading}
                    </div>
                </div>
            </div>
        );
    }
});
