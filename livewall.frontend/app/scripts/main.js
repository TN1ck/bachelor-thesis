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
import {ReactTile} from './tiles.js';

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

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
            width: window.innerWidth
        }
    },
    componentDidMount: function() {

        actions.loadItems();

        // proof of concept for making it responsive when resizing
        window.addEventListener('resize', () => {

            var width = window.innerWidth;

            if (this.state.width === width) {
                return;
            }
            
            if (this.resizeCallback) {
                clearTimeout(this.resizeCallback);    
            }

            this.resizeCallback = setTimeout(() => {
                this.setState({width: width});
                this.resizeCallback = false;
            }, 200);

        });
    },
    componentDidUpdate: function(props, state) {
        if (state.width !== this.state.width) {
            Layout.relayout();
        }
    },
    render: function () {
        var chunks = _.range(calculateColumns(this.state.width)).map(i => { return Immutable.List(); });

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