import React               from 'react/addons';
import {
    Grid, Row, Col, Input, Button,
    Jumbotron, Alert, PageHeader
} from 'react-bootstrap';

import SETTINGS            from '../settings.js';
import {user, requireAuth} from '../auth.js';
import actions             from '../actions/actions.js';
import {dataStore}         from '../stores/data.js';

import t from '../../shared/translations/translation.js';


// import {ReactSourceSelect, ReactSource} from './sources.js';

export default React.createClass({
    displayName: 'settings',
    render: function () {

        return (
            <Grid>
                <Row>
                    <Col xs={12}>
                        <PageHeader>
                            <h1>{t.settings.header}</h1>
                            <hr/>
                            <p>{t.settings.subHeader}</p>
                        </PageHeader>
                    </Col>
                </Row>
            </Grid>
        );
    }
});
