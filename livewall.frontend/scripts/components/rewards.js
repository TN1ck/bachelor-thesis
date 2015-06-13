import React               from 'react/addons';

import {SETTINGS}          from '../settings.js';
import {user, requireAuth} from '../auth.js';

import {dataStore}         from '../stores/data.js';
import actions             from '../actions/actions.js';
import {camelCaseToBar}    from '../util/utils.js';
import { hashCode }        from '../util/utils.js';
import rewards             from '../gamification/rewards.js';

import {
    Grid, Row, Col, Input, Button,
    Jumbotron, Alert, PageHeader, Label, Well, Panel
} from 'react-bootstrap';

// import {ReactSourceSelect, ReactSource} from './sources.js';

export default React.createClass({
    displayName: 'rewards',
    getInitialState: function () {
        return {
            settings: SETTINGS
        }
    },
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

        var colorSchemas = rewards.colors.map(colorSchema => {
            var {schema, id, name, points} = colorSchema;

            var coloredWords = words.map(word => {
                var color = schema(hashCode(word));
                return <span><Label style={{backgroundColor: color}}>{word}</Label> </span>;
            });

            return <Col md={6} xs={12}>
                <Panel>
                    <h5>{name}</h5>
                    {coloredWords}
                    <br/>
                    <br/>
                    <Button bsStyle='primary'>
                        Für <strong>{points}</strong> freischalten
                    </Button>
                </Panel>
            </Col>;

        });

        return (
            <Grid>
                <Row>
                    <Col xs={12}>
                        <PageHeader>
                            <h1>Belohnungen</h1>
                            <hr/>
                            <p>
                                Hier können Sie ihre gesammelten Punkte gegen Belohnungen eintauschen.
                                Dies verringert jedoch nicht ihren offiziellen Punktestand,
                                Ihre Platzierung nimmt somit nicht ab wenn sie die Punkte ausgeben.
                            </p>
                        </PageHeader>
                    </Col>
                    <Col xs={12}>
                        <h3>Farbschemas</h3>
                        Mittels der Farbschema können Sie die Farben der Suchergebnisse variieren. Unter den Einstellungen können Sie das Farbschema anpassen.
                        In den Einstellungen können Sie die zwischen den erworbenen Schemas wechseln.
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
