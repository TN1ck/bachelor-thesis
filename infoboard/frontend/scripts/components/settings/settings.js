import React               from 'react/addons';
import _                   from 'lodash';
import Reflux              from 'reflux';

import SETTINGS            from '../../settings.js';

import RadioInput          from '../utility/RadioInput.js';
import actions             from '../../actions/actions.js';
import gameStore           from '../../stores/game.js';
import translationStore    from '../../stores/translation.js';
import {hashCode}          from '../../../shared/util/utils.js';
import rewards             from '../../../shared/gamification/rewards.js';

import translations        from '../../../shared/translations';

import {
    Grid, Row, Col, Button,
    Label, Panel
} from 'react-bootstrap';

// words used for the coloschemas
var WORDS = [
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

/**
 * Creates a list of colored words with the specified colorschema and gives
 * the user the possibility to switch to the schema - if his level is high enough.
 */
var ColorSchema = React.createClass({

    propTypes: {
        schema: React.PropTypes.object,
        active: React.PropTypes.bool,
        onClick: React.PropTypes.func,
        level: React.PropTypes.number
    },

    render: function () {

        var {schema, id, name, level} = this.props.schema;
        var t = this.props.translation;

        var coloredWords = WORDS.map(word => {
            var color = schema(hashCode(word));
            return <span><Label style={{backgroundColor: color}}>{word}</Label> </span>;
        });

        // he can choose the schema if his level is high enough
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
                    <Button
                        onClick={() => this.props.onClick('color_scheme', id)}
                        active={active}
                        disabled={!isAllowedToUse}>
                        {buttonText}
                    </Button>
                </div>
            </Panel>
        </Col>;
    }
});

/**
 * The settings-page
 */
export default React.createClass({
    displayName: 'setings',

    mixins: [Reflux.connect(gameStore)],

    /**
     * Permantly save a setting
     *
     * @param {String} id The key of the setting to be saved
     * @param {*} value The value of the setting to be saved
     */
    save: function (id, value) {
        SETTINGS.save(id, value);
        this.setState({
            settings: SETTINGS
        });
        actions.changeColorScheme(value);
    },

    /**
     * Creates a list of colorschemes
     */
    createColorSchemes: function () {

        var currentlySelected = SETTINGS.color_scheme;
        var level = this.state.level;

        return rewards.filter(r => {
            // only use the rewards that have the type `color_scheme`
            return r.type === 'color_scheme';
        }).map(schema => {
            // is true when the schema is currently selected
            var active = schema.id === currentlySelected;
            return <ColorSchema
                translation={this.props.translation}
                onClick={this.save}
                active={active}
                level={level}
                schema={schema}/>;
        });
    },

    /**
     * Creates radios to select between languages
     */
    createLanguageSettings: function () {

        var t = this.props.translation;

        var languages = _.map(translations, (v, k) => {
            return (
                <RadioInput
                    checked={k === translationStore.state.language}
                    onChange={() => actions.changeLanguage(k)}
                    value={k}
                    label={v.full}/>
            );
        });

        return (
            <Col xs={12}>
                <h3>{t.settings.language.header}</h3>
                <p>{t.settings.language.subHeader}</p>
                {languages}
            </Col>
        );
    },

    render: function () {

        var t = this.props.translation;

        return (
            <Grid>
                <Row>
                    <Col xs={12}>
                        <h1>{t.settings.header}</h1>
                        <hr/>
                        <p>{t.settings.subHeader}</p>
                    </Col>
                    {this.createLanguageSettings()}
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
