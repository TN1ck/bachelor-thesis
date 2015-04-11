'use strict';

import React from 'react/addons';
import {Link, Route, RouteHandler} from 'react-router';

import actions from '../actions.js';
import {dataStore} from '../stores.js';
import {user} from '../auth.js';

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

export var ReactLogout = React.createClass({
    componentDidMount: function () {
        user.logout();
        dataStore.reset();
    },
    render: function () {
        return (
            <div className='wall__login'>
                <div className="wall__login__header">
                    Sie haben sich erfolgreich ausgeloggt.
                </div>
                <div className="wall__login__content">
                    <div className='center'>
                        <i className="fa fa-5x fa-check olive"></i>
                    </div>
                    <div className='center'>
                        <Link to="login">
                            <button>Anmelden</button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
});

export var ReactLogin = React.createClass({
    displayName: 'login',
    contextTypes: {
        router: React.PropTypes.func.isRequired
    },
    getInitialState: function () {
        return {
            remember: true,
            loading: false,
            error: false
        };
    },
    handleSubmit: function (e) {

        e.preventDefault();

        var router = this.context.router;
        var nextPath = router.getCurrentQuery().nextPath;

        var username = this.refs.username.getDOMNode().value;
        var password = this.refs.password.getDOMNode().value;

        user.login(username, password, this.state.remember).then(() => {
            if (!user.isLogedIn())
                return this.setState({ error: true });
            if (nextPath) {
                router.replaceWith(nextPath);
            } else {
                router.replaceWith('/');
            }
        }).fail(() => {
            this.setState({error: true});
        });


    },
    handleChange: function (e) {
        this.setState({
            remember: !this.state.remember
        });
    },
    render: function () {

        var loading = <i className="fa fa-spinner fa-pulse"></i>;

        var userStatus = user.isLogedIn();

        var text = {
            notLoged: 'Melden Sie sich an um die DAI-Wall zu benutzen.',
            Loged: 'Sie sind bereits angemeldet, wollen sie sich abmelden?',
            error: 'Ein Fehler ist aufgetreten, bitte stellen Sie sicher das ihr Benutzername und das zugehörige Passwort korrekt sind.'
        };

        var error;
        if (this.state.error) {
            error = <div className='error'>
                <b>Oh nein... </b>
                <p>{text.error}</p>
            </div>
        };

        var loginForm = <form onSubmit={this.handleSubmit}>
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
            <div className='center'>
                <button disabled={this.state.loading}>
                    Anmelden {this.state.loading ? loading : ''}
                </button>
            </div>
        </form>;

        var logoutForm = <div className='center'>
            <Link to="logout">
                <button>Abmelden</button>
            </Link>
        </div>;

        return (
            <div className='wall__login'>
                <div className="wall__login__header">
                    {userStatus ? text.Loged : text.notLoged}
                </div>
                <div className="wall__login__content">
                    {error}
                    {userStatus ? logoutForm : loginForm}
                </div>
            </div>
        );
    }
});
