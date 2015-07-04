import React               from 'react/addons';
import Reflux              from 'reflux';

import SETTINGS            from '../settings.js';
import {user, requireAuth} from '../auth.js';

import gameStore           from '../stores/game.js';
import actions             from '../actions/actions.js';
import {camelCaseToBar, hashCode}    from '../../shared/util/utils.js';
import rewards             from '../../shared/gamification/rewards.js';

import t from '../../shared/translations/translation.js';

import {
    Grid, Row, Col, Input, Button, Badge,
    Jumbotron, Alert, PageHeader, Label, Well, Panel
} from 'react-bootstrap';

// import {ReactSourceSelect, ReactSource} from './sources.js';
//

var ColorSchema = React.createClass({
    render: function () {

        var words = [
            'politics',
            'machine',
            'dai',
            'test',
            'wurst',
            'hamburg',
            'münchen',
            'berlin',
            'münster',
            'systeme',
            'tastatur',
            'apple',
            'gamification'
        ];

        var {schema, id, name, points} = this.props.schema;

        var coloredWords = words.map(word => {
            var color = schema(hashCode(word));
            return <span><Label style={{backgroundColor: color}}>{word}</Label> </span>;
        });

        var label;



        return <Col md={6} xs={12}>
            <Panel>
                <h5>{name}</h5>
                {coloredWords}
                <br/>
                <Label bsStyle='success' className='pull-right'>freigeschaltet</Label>
            </Panel>
        </Col>;
    }
});

export default React.createClass({
    displayName: 'rewards',
    mixins: [
        Reflux.connect(gameStore),
    ],
    render: function () {

        var colorSchemas = rewards.map(schema => {
            return <ColorSchema schema={schema}/>
        });



        return (
            <Grid>
                <Row>
                    <Col xs={12}>
                        <h1>{t.rewards.header}</h1>
                        <hr/>
                        <p>{t.rewards.subHeader}</p>
                    </Col>
                    <Col xs={12}>
                        <h3>{t.rewards.colors.header}</h3>
                        <p>{t.rewards.colors.subHeader}</p>
                        <hr/>
                        <Row>
                        {colorSchemas}
                        </Row>
                    </Col>
                    <Col xs={12}>
                        <h3>{t.rewards.backgrounds.header}</h3>
                        <p>{t.rewards.backgrounds.subHeader}</p>
                        <hr />
                    </Col>
                    <Col xs={12}>
                        <h3>{t.rewards.advanced.header}</h3>
                        <p>{t.rewards.advanced.subHeader}</p>
                        <hr/>
                    </Col>
                </Row>
            </Grid>
        );
    }
});
