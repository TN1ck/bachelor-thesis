import React     from 'react/addons';
import {Link}    from 'react-router';
import actions   from '../../actions/actions.js';

import {
    Grid, Row, Col,
    Button, PageHeader
} from 'react-bootstrap';

/**
 * Trigger the sign-out and shows a success-message
 */
export default React.createClass({
    displayName: 'Logout',

    componentWillMount: function () {
        // log out the user
        actions.logout();
    },

    render: function () {

        var t = this.props.translation;

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
