import React     from 'react/addons';
import {Link}    from 'react-router';
import dataStore from '../../stores/data.js';
import actions   from '../../actions/actions.js';

import {
    Grid, Row, Col, Input,
    Button, Jumbotron, Alert, PageHeader
} from 'react-bootstrap';

import t from '../../../shared/translations/translation.js';

export default React.createClass({
    componentWillMount: function () {
        actions.logout();
    },
    render: function () {

        return (
            <Grid>
                <Row>
                    <Col xs={12} md={6} mdOffset={3}>
                        <PageHeader>
                            <h1>{t.auth.logout.success}</h1>
                            <hr/>
                        </PageHeader>
                      <h4>{t.auth.logout.again}</h4>
                      <Link to="login">
                          <Button bsStyle='success'>
                          {t.auth.label.login}
                          </Button>
                      </Link>
                    </Col>
                </Row>
            </Grid>
        );
    }
});
