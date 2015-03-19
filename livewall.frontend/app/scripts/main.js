'use strict';

import _ from 'lodash';
import React from 'react';
import Reflux from 'reflux';
import Immutable from 'immutable';

import actions from './actions.js';
import SETTINGS from './settings.js';
import {RedditSource, PiaSource} from './sources.js';
import {calculateColumns} from './utils.js';
import Layout from './layout.js';
import {userStore, dataStore} from './stores.js';

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var ReactImageTile = React.createClass({
    displayName: 'ImageTile',
    render: function () {
        return (
            <div className="tile-content tile-image">
                <div className="tile-content-image">
                    <img src={this.props.tile.get('url')}></img>
                    <div className="tile-content-domain">
                        {this.props.tile.get('domain')}
                    </div>
                </div>
                <div className="tile-content-title">{this.props.tile.get('title')}</div>
            </div>
        );
    }
});

var ReactLinkTile = React.createClass({
    displayName: 'LinkTile',
    render: function () {
        return (
            <div className="tile-content tile-link">
                <div className="tile-content-title">
                    <a href={this.props.tile.get('url')}>{this.props.tile.get('title')}</a>
                </div>
                <div className="tile-content-domain">
                    {this.props.tile.get('domain')}
                </div>
            </div>
        );
    }
});

var ReactPiaTile = React.createClass({
    displayName: 'PiaTile',
    render: function () {
        var lis = this.props.tile.get('content').map((d) => {
            return <li dangerouslySetInnerHTML={{__html: d}}></li>
        });
        return (
            <div className="tile-content tile-pia">
                <div className="tile-content-title">
                    <a href={this.props.tile.get('url')}>{this.props.tile.get('title')}</a>
                </div>
                <div className="tile-content-content">
                    <a href={this.props.tile.get('url')}>
                        <ul>
                            {lis}
                        </ul>
                    </a>
                </div>
                <div className="tile-content-domain">
                    {this.props.tile.get('domain')}
                </div>
            </div>
        );
    }
});

var tileTypes = {
    image: ReactImageTile,
    link: ReactLinkTile,
    pia: ReactPiaTile
};

var ReactTile = React.createClass({
    displayName: 'tile',
    componentDidMount: function () {
        var dom = this.getDOMNode();
        // var width = dom.offsetWidth;
        // var height = dom.offsetHeight;
        Layout.addTile(dom, this.props.tile);
        Layout.layout();
    },
    componentWillUnmount: function () {
        Layout.removeTile(this.props.tile);
        Layout.layout();
    },
    handleUpvote: function (e) {
        e.preventDefault;
        actions.upvoteItem(this.props.tile);
    },
    shouldComponentUpdate: function (props) {
        // the sole reason we are using immutable data structures
        return props.tile.get('score') !== this.props.tile.get('score');
    },
    componentDidUpdate: function (props) {
        Layout.layout();
    },
    render: function () {
        
        var tile = React.createElement(tileTypes[this.props.tile.get('type')], {tile: this.props.tile});
        
        return (
            <article className='tile animate-2'>
                <header className='tile-header'>
                    <div className='tile-header-upvote' onClick={this.handleUpvote}>
                        {this.props.tile.get('score')}
                    </div>
                    <div className='tile-header-info'>
                        von {this.props.tile.get('author')}
                    </div>
                </header>
                {tile}
            </article>
        );

    }
});

var ReactTileColumn = React.createClass({
    displayName: 'column',
    render: function () {
        var tiles = this.props.tiles.toArray().map((tile) => {
            return <ReactTile tile={tile} key={tile.get('uuid')}/>;
        });

        return (
            <div className='tile-column' style={this.props.style}>
                {tiles}
            </div>
        );
    }
});

var ReactWall = React.createClass({
    displayName: 'wall',
    mixins: [Reflux.listenTo(dataStore, "onStatusChange")],
    onStatusChange: function(items) {
        this.setState({items: items});
    },
    getInitialState: function () {
        return {
            items: Immutable.List(),
            numberOfColumns: calculateColumns()
        }
    },
    componentDidMount: function() {

        actions.loadItems();

        // proof of concept for making it responsive when resizing
        window.addEventListener('resize', () => {
            
            if (this.resizeCallback) {
                clearTimeout(this.resizeCallback);    
            }

            this.resizeCallback = setTimeout(() => {
                columns = calculateColumns();
                // var copy = _.clone(TileStore.tiles);
                Layout.tiles = [];
                this.setState({items: Immutable.List()});
                this.setState({items: dataStore.items, numberOfColumns: columns})
                this.resizeCallback = false;
            }, 200);

        });
    },
    render: function () {
        var chunks = _.range(this.state.numberOfColumns).map(i => { return Immutable.List(); });

        this.state.items.forEach((item, i) => {
            var index = i % chunks.length;
            chunks[index] = chunks[index].push(item);
        });
        // var style = {width: 'calc(' + 100 / this.state.numberOfColumns + '% - 20px)' }
        var style = {};
        var columns = chunks.map(items => <ReactTileColumn tiles={items} style={style}/>);
        return (
            <div>
                {columns}
            </div>
        );
    }
});

var ReactLogin = React.createClass({
    mixins: [Reflux.listenTo(userStore, "onStatusChange")],
    getInitialState: function () {
        return {
            user: {},
            remember: true,
            loading: false,
            error: false
        };
    },
    onStatusChange: function(user) {
        this.setState({user: user, loading: false});
    },
    handleSubmit: function (e) {
        
        e.preventDefault();
        
        var username = this.refs.username.getDOMNode().value;
        var password = this.refs.password.getDOMNode().value;

        actions.login({
            username: username,
            password: password,
            keep: this.state.remember
        });
        
    },
    handleChange: function (e) {
        this.setState({
            remember: !this.state.remember
        });
    },
    render: function () {

        var loading = <i className="fa fa-spinner fa-pulse"></i>;
        
        return (
            <form className="wall-login from-above" onSubmit={this.handleSubmit}>
                <div className="wall-login-header">
                    Du musst angemeldet sein um die dai-wall zu benutzen
                </div>
                <div className="wall-login-content">
                    <div className="labelgroup">
                        <label htmlFor="username">Benutzername</label>
                        <input disabled={this.state.loading} ref="username" id="username" placeholder="Benutzername" required autofocus/>
                    </div>
                    <div className="labelgroup">
                        <label htmlFor="password">Password</label>
                        <input ref="password" id="password" type="password" placeholder="Password" required/>
                    </div>
                    <label htmlFor="remember">
                        <input checked={this.state.remember} onChange={this.handleChange} ref="remember" id="remember" type="checkbox" /> Eingeloggt bleiben
                    </label>
                    <button disabled={this.state.loading}>
                        Anmelden {this.state.loading ? loading : ''}
                    </button>
                </div>
            </form>
        );
    }
});


var ReactApp = React.createClass({
    mixins: [Reflux.listenTo(userStore, "onStatusChange")],
    onStatusChange: function(user) {
        this.setState({user: user});
    },
    handleLogout:  function () {
        actions.logout();
    },
    getInitialState: function () {
        return {
            user: userStore.getState(),
        };
    },
    render: function () {
        var header = (
            <div className='wall-header'>
                <div className='wall-header-info'>
                    Angemeldet als {this.state.user.username}
                </div>
                <div className='wall-header-settings'>
                    <span>settings</span> | <span onClick={this.handleLogout}>logout</span>
                </div>
            </div>
        );

        var login;

        if (!this.state.user.token) {
            login = <ReactLogin />;
        }

        return (
            <div className='wall'>
                <div className={this.state.user.token ? '' : 'blur'}>
                    {header}
                    <ReactWall user={this.state.user} />
                </div>
                <ReactCSSTransitionGroup transitionName="from-above" transitionAppear={true}>
                    {login}
                </ReactCSSTransitionGroup>
            </div>
        );
    }
});

React.render(<ReactApp/>, document.getElementById('react'));