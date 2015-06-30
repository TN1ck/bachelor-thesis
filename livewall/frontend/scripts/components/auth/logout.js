import React     from 'react/addons';
import {Link}    from 'react-router';

import {user}    from '../../auth.js';
import dataStore from '../../stores/data.js';

import {
    Grid, Row, Col, Input,
    Button, Jumbotron, Alert, PageHeader
} from 'react-bootstrap';

export var ReactLogout = React.createClass({
    componentDidMount: function () {
        user.logout();
        dataStore.reset();
    },
    render: function () {
        return (
            <Grid>
                <Row>
                    <Col xs={12} md={6} mdOffset={3}>
                        <PageHeader>
                            <h1>Sie haben sich erfolgreich ausgeloggt.</h1>
                            <hr/>
                        </PageHeader>
                      <h4>Melden Sie sich an um wieder die Enterprise-Wall wieder zu benutzen</h4>
                      <Link to="login">
                          <Button bsStyle='success'>
                          Anmelden
                          </Button>
                      </Link>
                    </Col>
                </Row>
            </Grid>
        );
    }
});
