'use strict';

import _ from 'lodash';
import React from 'react';
import Reflux from 'reflux';
import Immutable from 'immutable';

import actions from './actions.js';
import SETTINGS from './settings.js';
import {RedditSource, PiaSource} from './sources.js';
import Layout from './layout.js';
import {userStore, dataStore} from './stores.js';
import {ReactTile} from './tiles.js';

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var ReactWall = React.createClass({
    displayName: 'wall',
    mixins: [Reflux.listenTo(dataStore, "onStoreChange"), Reflux.listenTo(userStore, "onUserChange")],
    onStoreChange: function(items) {
        this.setState({items: items});
    },
    onUserChange: function(items) {
        console.log('userchange');
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
            loading = <i className="fa fa-spinner fa-pulse white fa-5x"></i>;
        }

        return (
            <div className='tiles'>
                {tiles}
                {loading}
            </div>
        );
    }
});

var ReactLogin = React.createClass({
    displayName: 'login',
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
                    {'Du musst angemeldet sein um die dai-wall in vollem Umfang zu benutzen'}
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

var ReactSource = React.createClass({
    displayName: 'source',
    render: function () {
        return (
            <li>
                <div className='source-container'>
                    <div className='source-name'>{this.props.source.source.getName()}</div>
                    <div className='source-search'>{this.props.source.source.search}</div>
                </div>
            </li>
        );
    }
});

var ReactHeader = React.createClass({
    displayName: 'header',
    getInitialState: function () {
        return {
            sources: dataStore.sources
        }
    },
    handleLogout:  function () {
        actions.logout();
    },
    render: function () {

        var sourceNames = _.map(this.state.sources, (s, k) => <ReactSource key={k} source={s}/>);

        return (
            <div className='wall-header'>
                <div className='wall-header-topbar'>
                    <div className='wall-header-info'>
                        Angemeldet als {this.props.user.username}
                    </div>
                    <div className='wall-header-settings'>
                        <span>settings</span> | <span onClick={this.handleLogout}>logout</span>
                    </div>
                </div>
                <div className='wall-header-sources'>
                    <ul>
                        {sourceNames}
                    </ul>
                </div>
            </div>
        );
    }
});


var ReactApp = React.createClass({
    displayName: 'app',
    mixins: [Reflux.listenTo(userStore, "onStatusChange")],
    onStatusChange: function(user) {
        this.setState({user: user});
    },
    getInitialState: function () {
        return {
            user: userStore.getState(),
            toggleLogin: true
        };
    },
    render: function () {

        var main;

        if (!this.state.user.token) {
          main = <ReactCSSTransitionGroup transitionName="from-above" transitionAppear={true}>
              <ReactLogin />
          </ReactCSSTransitionGroup>;
        } else {
          main = <div className={this.state.toggleLogin ? 'wall-container animate-1' : 'wall-container menu-open' } >
            <div className='wall'>
                <ReactHeader user={this.state.user}/>
                <div className={this.state.user.token ? '' : 'blur'}>
                    <ReactWall user={this.state.user} />
                </div>
            </div>
          </div>;
        }

        return (
          <div>
            {main}
          </div>
        );
    }
});

React.render(<ReactApp/>, document.getElementById('react'));
