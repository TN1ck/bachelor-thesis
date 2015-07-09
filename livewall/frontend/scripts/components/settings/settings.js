import React               from 'react/addons';
import Reflux              from 'reflux';

import SETTINGS            from '../../settings.js';

import gameStore           from '../../stores/game.js';
import actions             from '../../actions/actions.js';
import {camelCaseToBar, hashCode}    from '../../../shared/util/utils.js';
import rewards             from '../../../shared/gamification/rewards.js';
import LEVELS              from '../../../shared/gamification/levels.js';

import t from '../../../shared/translations/translation.js';

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
            'gamification',
            'microsoft',
            'musik',
            'hund',
            'katze',
            'kiel',
            'buch'
        ];

        var {schema, id, name, level} = this.props.schema;

        var coloredWords = words.map(word => {
            var color = schema(hashCode(word));
            return <span><Label style={{backgroundColor: color}}>{word}</Label> </span>;
        });

        var isAllowedToUse = level <= this.props.level;

        var buttonText = {
            false: <span>{t.settings.youAreMissing} {level - this.props.level} {t.label.level}</span>,
            true: t.label.select
        }[isAllowedToUse];

        var active = this.props.active;

        if (active) {
            buttonText = t.label.currentlySelected;
        }

        return <Col xs={12}>
            <Panel bsStyle={active ? 'primary' : 'default'}>
                <h5>{name}</h5>
                {coloredWords}
                <br/>
                <div className='pull-right'>
                    <Button onClick={() => this.props.onClick('color_scheme', id)} active={true} disabled={!isAllowedToUse}>
                        {buttonText}
                    </Button>
                </div>
            </Panel>
        </Col>;
    }
});

export default React.createClass({
    displayName: 'setings',
    mixins: [
        Reflux.connect(gameStore),
    ],
    getDefaultProps: function () {
        return {
            settings: SETTINGS
        };
    },
    save: function (id, value) {
        SETTINGS.save(id, value);
        this.setState({
            settings: SETTINGS
        });
    },
    createColorSchemes: function () {

        var currentlySelected = SETTINGS.color_scheme;
        var level = this.state.level;
        var points = this.state.alltime.user.points.all;

        return rewards.filter(r => {
            return r.type === 'color_scheme';
        }).map(schema => {
            var active = schema.id === currentlySelected;
            return <ColorSchema onClick={this.save} active={active} level={level} points={points} schema={schema}/>
        });
    },
    render: function () {
        return (
            <Grid>
                <Row>
                    <Col xs={12}>
                        <h1>{t.settings.header}</h1>
                        <hr/>
                        <p>{t.settings.subHeader}</p>
                    </Col>
                    <Col xs={12}>
                        <h3>{t.settings.rewards.colors.header}</h3>
                        <p>{t.settings.rewards.colors.subHeader}</p>
                        <hr/>
                        <Row>
                            {this.createColorSchemes()}
                        </Row>
                    </Col>
                </Row>
            </Grid>
        );
    }
});
