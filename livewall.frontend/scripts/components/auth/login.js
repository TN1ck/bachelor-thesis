'use strict';

import React from 'react/addons';
import { Grid, Row, Col, Input, Button, PageHeader, Alert } from 'react-bootstrap';
import {Link, Route, RouteHandler} from 'react-router';


import actions from '../../actions.js';
import {user} from '../../auth.js';
import {dataStore} from '../../stores/data.js';

export var ReactLogin = React.createClass({
    displayName: 'login',
    contextTypes: {
        router: React.PropTypes.func.isRequired
    },
    getInitialState: function () {
        return {
            remember: true,
            loading: false,
            error: false,
            isLogedIn: false
        };
    },
    handleSubmit: function (e) {

        e.preventDefault();

        var router = this.context.router;
        var nextPath = router.getCurrentQuery().nextPath;

        var username = this.refs.username.getValue();
        var password = this.refs.password.getValue();

        this.setState({loading: true});
        user.login(username, password, this.state.remember).then(() => {
            if (!user.isLogedIn())
                return this.setState({ error: true, loading: false });
            if (nextPath) {
                router.replaceWith(nextPath);
            } else {
                router.replaceWith('/');
            }
        }).fail(() => {
            this.setState({error: true, loading: false});
        });


    },
    componentWillMount: function () {
        user.isLogedIn(() => {
            this.setState({isLogedIn: true});
        });
    },
    handleChange: function (e) {
        this.setState({
            remember: !this.state.remember
        });
    },
    render: function () {

        var loading = <i className="fa fa-spinner fa-pulse"></i>;

        var text = {
            notLoged: 'Anmelden',
            Loged: 'Sie sind bereits angemeldet, wollen sie sich abmelden?',
            error: 'Ein Fehler ist aufgetreten, bitte stellen Sie sicher das ihr Benutzername und das zugehörige Passwort korrekt sind.'
        };

        var error;
        if (this.state.error) {
            error = <Alert bsStyle='danger'>
                <h4>Oh nein... </h4>
                <p>{text.error}</p>
            </Alert>
        };

        var bsStyle = this.state.error ? 'error' : '';

        var loginForm = <form onSubmit={this.handleSubmit}>
            <Input
                disabled={this.state.loading}
                bsStyle={bsStyle}
                type='text'
                autofocus
                placeholder='Benutzername'
                hasFeedback
                label='Benutzername'
                ref='username'
            />
            <Input
                disabled={this.state.loading}
                bsStyle={bsStyle}
                type='password'
                placeholder='Passwort'
                hasFeedback
                label='Passwort'
                ref='password'
            />
            <Input
                disabled={this.state.loading}
                onChange={this.handleChange}
                value={this.state.remember}
                type='checkbox'
                hasFeedback
                label='Angemeldet bleiben'
                ref='remember'
            />
            <Button
                disabled={this.state.loading}
                bsStyle='primary' type='submit'
                onSubmit={this.handelSubmit}>
                Anmelden {this.state.loading ? loading : ''}
            </Button>
        </form>;

        var logoutForm = <div className='center'>
            <Link to="logout">
                <Button bsStyle='primary'>Abmelden</Button>
            </Link>
        </div>;

        return (
            <Grid>
                <Row>
                    <Col xs={12} md={6} mdOffset={3}>
                    <PageHeader>
                        <h1>{this.state.isLogedIn ? text.Loged : text.notLoged}</h1>
                        <hr/>
                    </PageHeader>
                    <div className="wall__login__content">
                        {error}
                        {this.state.isLogedIn ? logoutForm : loginForm}
                    </div>
                    </Col>
                </Row>
            </Grid>
        );
    }
});
