import React from 'react/addons';
import {
    Grid, Row, Col, Input, Button,
    PageHeader, Alert, ButtonGroup,
} from 'react-bootstrap';
import CheckBoxInput from '../utility/CheckBoxInput.js';

import actions from '../../actions/actions.js';

import {user} from '../../auth.js';

export default React.createClass({
    displayName: 'Login',

    contextTypes: {
        router: React.PropTypes.func.isRequired
    },

    getInitialState: function () {
        return {
            remember: true,
            loading: false,
            error: false,
            isLoggedIn: 'loading'
        };
    },

    handleSubmit: function (e) {

        e.preventDefault();

        var router = this.context.router;
        var nextPath = router.getCurrentQuery().nextPath;

        var username = this.refs.username.getValue();
        var password = this.refs.password.getValue();

        this.setState({loading: true});

        actions.login(username, password, this.state.remember, () => {
            if (nextPath) {
                router.replaceWith(nextPath);
            } else {
                router.replaceWith('/');
            }
        }, () => {
            this.setState({error: true, loading: false});
        });

    },

    componentWillMount: function () {
        user.isLoggedIn((result) => {
            this.setState({isLoggedIn: result});
        });
    },

    handleChange: function (value) {
        this.setState({
            remember: value
        });
    },

    render: function () {

        var t = this.props.translation;

        var loading = <i className="fa fa-spinner fa-pulse"></i>;

        var error;

        if (this.state.error) {
            error = (
                <Alert bsStyle='danger'>
                    <h4>{t.auth.login.error.header}</h4>
                    <p>{t.auth.login.error.text}</p>
                </Alert>
            );
        }

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
            <div>
                <CheckBoxInput
                    checked={this.state.remember}
                    onChange={this.handleChange}
                    label={t.auth.label.remember}/>
                <Button
                    className='pull-right'
                    disabled={this.state.loading}
                    bsStyle='primary' type='submit'
                    onSubmit={this.handelSubmit}>
                    {t.auth.label.login} {this.state.loading ? loading : ''}
                </Button>
            </div>
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
        }[this.state.isLoggedIn];

        return (
            <Grid>
                <Row>
                    <Col xs={12} md={6} mdOffset={3}>
                        <PageHeader>
                            <h1>{headerText}</h1>
                            <hr/>
                            <Alert bsStyle='danger'>
                                {t.auth.everythingWorks}
                            </Alert>
                        </PageHeader>
                        {error}
                        {this.state.isLoggedIn ? logoutForm : loginForm}
                    </Col>
                </Row>
            </Grid>
        );
    }
});
