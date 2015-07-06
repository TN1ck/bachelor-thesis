import React               from 'react/addons';
import Reflux              from 'reflux';
import moment              from 'moment';

import SETTINGS            from '../settings.js';
import {user, requireAuth} from '../auth.js';

import gameStore           from '../stores/game.js';
import actions             from '../actions/actions.js';

import IconCard from './utility/iconcard.js';
import Award from './trophies/awards.js';

import t from '../../shared/translations/translation.js';

import booster from '../../shared/gamification/booster.js';

import {postBooster} from '../api/api.js';

import {
    Grid, Row, Col, Input, Button, Badge,
    Jumbotron, Alert, PageHeader, Label, Well, Panel
} from 'react-bootstrap';

// import {ReactSourceSelect, ReactSource} from './sources.js';
//

var BoosterComponent = React.createClass({
    getInitialState: function () {
        return {
            loading: false
        };
    },
    buyBooster: function () {
        this.setState({
            loading: true
        });
        postBooster(this.props.booster.id).then((booster) => {
            console.log(booster);
            this.setState({
                loading: false
            });
        });
    },
    render: function () {
        var {
            name, duration, text, image,
            points, type, fill
        } = this.props.booster;

        var buttonText = {
            false: <span>Für <strong>{points}</strong> kaufen</span>,
            true: <span>Sie haben einen Booster aktiv</span>
        }[this.props.disable];

        var body = (
            <span>
                <h5>{name}</h5>
                <hr />
                <p>
                    {text}
                    <br/>
                    <Button className='pull-right' onClick={this.buyBooster}>
                        {buttonText}
                    </Button>
                </p>
            </span>
        );

        var icon = (
            <Award
                image={image}
                type={type}
                fill={fill}
            />
        );

        return (
            <IconCard md={12} body={body} icon={icon}/>
        );

    }
});

export default React.createClass({
    displayName: 'booster',
    mixins: [
        Reflux.connect(gameStore),
    ],
    createBooster: function (_booster) {
        return booster.map(b => <BoosterComponent disable={_booster.isActive} booster={b}/>)
    },
    render: function () {

        var _booster;

        var b = {
            isActive: false
        };

        var userBooster = this.state.alltime.user.booster;
        var lastBooster = _.sortBy(userBooster, '-validUntil')[0];

        if (lastBooster) {
            var validUntil = moment(lastBooster.validUntil);
            var boosterIsActive = moment().isBefore(validUntil);
            b.validUntil = validUntil;
            b.isActive = boosterIsActive;
            b.last = lastBooster;
        }

        if (b.isActive) {
            var hours = moment(b.validUntil).subtract(moment()).hours();
            _booster = (
                <strong><h3>Booster aktiv, noch {hours} Stunden verbleibend.</h3></strong>
            );
        }

        return (
            <Grid>
                <Row>
                    <Col xs={12}>
                        <h1>Power-Ups kaufen</h1>
                        <hr/>
                        <p>Mittels von Power-Ups können Sie schneller Punkte sammeln, sie kosten jedoch Punkte und die Dauer ist begrenzt.</p>
                        <p>Bisher hast du {this.state.alltime.user.booster.length} Power-Ups gekauft</p>
                        {_booster}
                    </Col>
                    {this.createBooster(b)}
                </Row>
            </Grid>
        );
    }
});
