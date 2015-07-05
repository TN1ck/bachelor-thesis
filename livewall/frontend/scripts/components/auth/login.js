import React from 'react/addons';
import {
    Grid, Row, Col, Input, Button,
    PageHeader, Alert, ButtonGroup
} from 'react-bootstrap';

import {Link, Route, RouteHandler} from 'react-router';

import {user} from '../../auth.js';

import t from '../../../shared/translations/translation.js';

export default React.createClass({
    displayName: 'login',
    contextTypes: {
        router: React.PropTypes.func.isRequired
    },
    getInitialState: function () {
        return {
            remember: true,
            loading: false,
            error: false,
            isLogedIn: 'loading'
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
        user.isLogedIn((result) => {
            this.setState({isLogedIn: result});
        });
    },
    handleChange: function (e) {
        this.setState({
            remember: !this.state.remember
        });
    },
    render: function () {

        var loading = <i className="fa fa-spinner fa-pulse"></i>;

        var error;

        if (this.state.error) {
            error = <Alert bsStyle='danger'>
                <h4>{t.auth.login.error.header}</h4>
                <p>{t.auth.login.error.text}</p>
            </Alert>
        };

        var bsStyle = this.state.error ? 'error' : '';

        var loginForm = <form onSubmit={this.handleSubmit}>
            <Input
                disabled={this.state.loading}
                bsStyle={bsStyle}
                type='text'
                autofocus
                placeholder={t.auth.label.username}
                hasFeedback
                label={t.auth.label.username}
                ref='username'
            />
            <Input
                disabled={this.state.loading}
                bsStyle={bsStyle}
                type='password'
                placeholder={t.auth.label.password}
                hasFeedback
                label={t.auth.label.password}
                ref='password'
            />
            <Input
                disabled={this.state.loading}
                onChange={this.handleChange}
                value={this.state.remember}
                type='checkbox'
                hasFeedback
                label={t.auth.label.remember}
                ref='remember'
            />
            <Button
                disabled={this.state.loading}
                bsStyle='primary' type='submit'
                onSubmit={this.handelSubmit}>
                {t.auth.label.login} {this.state.loading ? loading : ''}
            </Button>
        </form>;

        var logoutForm = <div>
            <ButtonGroup justified>
                <Button href="#/logout" bsStyle='danger'>{t.auth.label.logout}</Button>
                <Button href="#/" bsStyle='primary'>{t.auth.label.wall}</Button>
            </ButtonGroup>
        </div>;

        var headerText = {
            true: t.auth.login.already,
            false: t.auth.label.login
        }[this.state.isLogedIn];

        return (
            <Grid>
                <Row>
                    <Col xs={12} md={6} mdOffset={3}>
                        <PageHeader>
                            <h1>{headerText}</h1>
                            <hr/>
                        </PageHeader>
                        {error}
                        {this.state.isLogedIn ? logoutForm : loginForm}
                    </Col>
                </Row>
            </Grid>
        );
    }
});