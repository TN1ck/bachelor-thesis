import React               from 'react/addons';
import Reflux              from 'reflux';

import {SETTINGS}          from '../settings.js';
import {user, requireAuth} from '../auth.js';

import gameStore           from '../stores/game.js';
import actions             from '../actions/actions.js';
import {camelCaseToBar}    from '../util/utils.js';
import { hashCode }        from '../util/utils.js';
import rewards             from '../gamification/rewards.js';

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
    getInitialState: function () {
        return {
            settings: SETTINGS
        }
    },
    mixins: [
        Reflux.connect(gameStore),
    ],
    render: function () {
        // var sources = this.state.settings.SOURCES.map(source => {
        //     var sourceHydrated = {
        //         source: {
        //             name: camelCaseToBar(source.name),
        //             search: source.search
        //         },
        //         loaded: true
        //     };
        //     return <ReactSource source={sourceHydrated}/>
        // });
        //
        //

        var colorSchemas = rewards.colors.map(schema => {
            return <ColorSchema schema={schema}/>
        });

        return (
            <Grid>
                <Row>
                    <Col xs={12}>
                        <h1>Freigeschaltete Features</h1>
                        <hr/>
                        <p>
                            Erreichen Sie eine bestimmte Punktzahl werden hier automatisch Features freigeschaltet.
                        </p>
                    </Col>
                    <Col xs={12}>
                        <h3>Farbschemas</h3>
                        Mittels der Farbschema können Sie die Farben der Suchergebnisse variieren. Unter den Einstellungen können Sie das Farbschema anpassen.
                        In den Einstellungen können Sie die zwischen den erhaltenen Schemas wechseln.
                        <hr />
                        <Row>
                        {colorSchemas}
                        </Row>
                    </Col>
                    <Col xs={12}>
                        <h3>Hintergrundbilder und Farben</h3>
                        Mittels der der Hintergrundbilder können Sie den global genutzten Hintergrund anpassen.
                        <hr />
                    </Col>
                    <Col xs={12}>
                        <h3>Erweiterte Funktionen</h3>
                        Durch Erweiterte Funktionen erhalten Sie mehr Macht in der Darstellung der Suchergebnissen,
                        sei es die Art der Gruppierung oder die Prioriesierung der Broker.
                        <hr />
                    </Col>
                </Row>
            </Grid>
        );
    }
});
