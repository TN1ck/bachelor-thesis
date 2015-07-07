import React               from 'react/addons';
import Reflux              from 'reflux';
import moment              from 'moment';
import durationFormat      from 'moment-duration-format';


import SETTINGS            from '../../settings.js';
import {user, requireAuth} from '../../auth.js';

import gameStore           from '../../stores/game.js';
import actions             from '../../actions/actions.js';

import IconCard            from '../utility/iconcard.js';
import Award               from '../trophies/awards.js';

import t                   from '../../../shared/translations/translation.js';

import booster             from '../../../shared/gamification/booster.js';

import {postBooster}       from '../../api/api.js';

import {
    Grid, Row, Col, Input, Button, Badge,
    Jumbotron, Alert, PageHeader, Label, Well, Panel
}                          from 'react-bootstrap';

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
            true: <span>Booster aktiv</span>
        }[this.props.disable];

        var _active;

        if (this.props.active) {
            _active = <strong>Dieser Booster ist im Moment aktiv.</strong>;
        }

        var body = (
            <span>
                <h5>{name}</h5>
                <hr />
                <p>
                    {text}
                    <br/>
                    {_active}
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
            <IconCard active={this.props.active} md={12} body={body} icon={icon}/>
        );

    }
});

export default React.createClass({
    displayName: 'booster',
    mixins: [
        Reflux.listenTo(gameStore, 'onStoreChange')
    ],
    getInitialState: function () {
        var state = gameStore.state;
        var booster = this.calcBooster(state)
        return _.extend({}, gameStore.state, {
            booster: booster,
            left: this.calcTimeLeft(booster)
        });
    },
    onStoreChange: function (state) {
        var booster = this.calcBooster(state)
        this.setState(_.extend(state, {
            booster: booster,
            left: this.calcTimeLeft(booster)
        }));
    },
    calcBooster: function (state) {

        var b = {
            isActive: false
        };

        var userBooster = state.alltime.user.booster;
        var lastBooster = _.sortBy(userBooster, '-validUntil')[0];

        if (lastBooster) {
            var validUntil = moment(lastBooster.validUntil);
            var boosterIsActive = moment().isBefore(validUntil);
            b.validUntil = validUntil;
            b.isActive = boosterIsActive;
            b.last = lastBooster;
        }

        return b;
    },
    calcTimeLeft: function (booster) {
        var left = moment.duration(moment(booster.validUntil).diff(moment()));
        return left;
    },
    createBooster: function () {
        return booster.map(b => {
            var active = _.get(this.state.booster, '.last.name') === b.id;
            return <BoosterComponent disable={this.state.booster.isActive} active={active} booster={b}/>
        })
    },
    componentDidMount: function () {
        this.interval = setInterval(() => {
            var left = this.calcTimeLeft(this.state.booster);
            this.setState({
                left: left
            });
        }, 500);
    },
    componentWillUnmount: function () {
        clearInterval(this.interval);
    },
    render: function () {

        var _booster;

        if (this.state.booster.isActive) {
            _booster = (
                <strong><h3>Booster aktiv, verbleibende Zeit: {this.state.left.format('hh:mm:ss')}</h3></strong>
            );
        }

        return (
            <Grid>
                <Row>
                    <Col xs={12}>
                        <h1>Booster kaufen</h1>
                        <hr/>
                        <p>Mittels von Booster können Sie schneller Punkte sammeln, sie kosten jedoch Punkte und die Dauer ist begrenzt.</p>
                        <p>Bisher hast du {this.state.alltime.user.booster.length} Booster gekauft</p>
                        {_booster}
                    </Col>
                    {this.createBooster()}
                </Row>
            </Grid>
        );
    }
});
