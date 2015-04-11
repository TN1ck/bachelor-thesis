'use strict';

import React from 'react/addons';
import Reflux from 'reflux';
import Immutable from 'immutable';

import Layout from '../layout.js';
import {dataStore} from '../stores.js';
import {user, requireAuth} from '../auth.js';
import actions from '../actions.js';

import {ReactTile} from './tiles.js';
import {ReactQueries} from './queries.js';

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

export var ReactWall = React.createClass({
    displayName: 'wall',
    mixins: [
        Reflux.listenTo(dataStore, "onStoreChange"),
        requireAuth
    ],
    onStoreChange: function(items) {
        this.setState({items: items});
    },
    getInitialState: function () {
        return {
            items: Immutable.List(),
            loading: true
        }
    },
    componentDidMount: function() {
        actions.loadItems();
    },
    componentDidUpdate: function(props, state) {
        if (this.state.items.count() !== state.items.count()) {
            Layout.layout(state.items.count() !== 0);
        }
    },
    render: function () {

        var tiles = this.state.items.toArray().map((tile) => {
            return <ReactTile tile={tile} key={tile.get('uuid')}/>;
        });
        var loading;
        if (tiles.length === 0) {
            loading = <i className="fa fa-gear fa-spin white fa-5x"></i>;
        }


        return (
            <div>
                <ReactQueries />
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
