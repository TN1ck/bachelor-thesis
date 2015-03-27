'use strict';

import _ from 'lodash';
import React from 'react/addons';
import Reflux from 'reflux';
import Immutable from 'immutable';
// import ReactSelect from 'reactSelect';

import actions from './actions.js';
import SETTINGS from './settings.js';
import {RedditSource, PiaSource} from './sources.js';
import Layout from './layout.js';
import {userStore, dataStore} from './stores.js';
import {ReactTile} from './tiles.js';
import {camelCaseToBar} from './utils.js';
import {RouteHandler, Link} from 'react-router';

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var requireAuth = {
    statics: {
        willTransitionTo: function (transition) {
            console.log('check login..', userStore.user.isLogedIn());
            if (!userStore.user.isLogedIn()) {
                transition.redirect('/login', {}, {'nextPath' : transition.path});
            }
        }
    }
};

export var ReactWall = React.createClass({
    displayName: 'wall',
    mixins: [
        Reflux.listenTo(dataStore, "onStoreChange"), Reflux.listenTo(userStore, "onUserChange"),
        requireAuth
    ],
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
            loading = <i className="fa fa-gear fa-spin white fa-5x"></i>;
        }

        return (
            <div className='tiles'>
                {tiles}
                <div className="wall-loader">
                    {loading}
                </div>
            </div>
        );
    }
});

export var ReactLogin = React.createClass({
    displayName: 'login',
    mixins: [Reflux.listenTo(userStore, "onStatusChange")],
    contextTypes: {
        router: React.PropTypes.func.isRequired
    },
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

        var router = this.context.router;
        var nextPath = router.getCurrentQuery().nextPath;

        var username = this.refs.username.getDOMNode().value;
        var password = this.refs.password.getDOMNode().value;

        actions.login({
            username: username,
            password: password,
            keep: this.state.remember,
            callback: () => {
                if (!userStore.user.isLogedIn())
                    return this.setState({ error: true });
                if (nextPath) {
                    router.replaceWith(nextPath);
                } else {
                    router.replaceWith('/');
                }
            }
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
            <div className='wall-login'>
                <form onSubmit={this.handleSubmit}>
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
            </div>
        );
    }
});

var ReactSource = React.createClass({
    displayName: 'source',
    removeSource: function () {
        actions.removeSource(this.props.source.source);
    },
    render: function () {
        var loading = <span className="fa-gear fa-spin"></span>;
        var remove = <span className="fa-remove"></span>;

        return (
            <li>
                <div className='source-container'>
                    <div className='source-name'>
                        {this.props.source.source.name}
                    </div>
                    <div className='source-search'>{this.props.source.source.search}</div>
                    <div className='source-button' onClick={this.removeSource}>{this.props.source.loaded ? remove : loading}</div>
                </div>
            </li>
        );
    }
});

var ReactHeader = React.createClass({
    displayName: 'header',
    mixins: [Reflux.listenTo(actions.changedSources, 'onSourceChange')],
    getInitialState: function () {
        return {
            sources: dataStore.sources,
        }
    },
    onSourceChange: function (sources) {
        this.setState({
            sources: sources
        })
    },
    handleLogout:  function () {
        actions.logout();
    },
    handleSubmit: function (e) {

        e.preventDefault();

        var selectedSource = this.refs.select.getDOMNode().value;
        var search         = this.refs.search.getDOMNode().value;
        actions.addSource({search: search, source: selectedSource});

    },
    render: function () {

        var sourceNames = _.map(this.state.sources, (s, k) => <ReactSource key={k} source={s}/>);

        var options = dataStore.availableSources.map(s => <option value={s.name}>{camelCaseToBar(s.name)}</option>)

        return (
            <div className='wall-header'>
                <div className='wall-header-topbar'>
                    <div className='wall-header-info'>
                        Angemeldet als {userStore.user.username}
                    </div>
                    <div className='wall-header-settings'>
                        <span>settings</span> | <span onClick={this.handleLogout}>logout</span>
                    </div>
                </div>
                <div className='wall-header-sources'>
                    <ul>
                        {sourceNames}
                    </ul>
                    <form className='select-group-container' onSubmit={this.handleSubmit}>
                        <div className='select-container'>
                            <select className='select' ref='select' defaultValue={"pia|zentral"}>
                                {options}
                            </select>
                        </div>
                        <div className='input'>
                            <input required ref='search'></input>
                        </div>
                        <button className='source-add'>
                        </button>
                    </form>
                </div>
            </div>
        );
    }
});

export var ReactAdmin = React.createClass({
    mixins: [requireAuth],
    render: function () {
        return (
            <div className='wall'>
                <ReactHeader/>
                <RouteHandler />
            </div>
        );
    }
})

export var ReactApp = React.createClass({
    displayName: 'app',
    componentWillMount () {
        userStore.user.loginViaCookie();
    },
    render: function () {
        return (
            <div>
                <ReactCSSTransitionGroup transitionName="from-above" transitionAppear={true}>
                    <RouteHandler />
                </ReactCSSTransitionGroup>
            </div>
        );
    }
});
