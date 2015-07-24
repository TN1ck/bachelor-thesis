import React               from 'react/addons';
import Reflux              from 'reflux';
import moment              from 'moment';
import durationFormat      from 'moment-duration-format';


import SETTINGS            from '../../settings.js';
import {user, requireAuth} from '../../auth.js';

import gameStore           from '../../stores/game.js';
import actions             from '../../actions/actions.js';

import IconCard            from '../utility/iconcard.js';
import Icon                from '../utility/icon.js';

import t                   from '../../../shared/translations/translation.js';

import booster             from '../../../shared/gamification/booster.js';

import {postBooster}       from '../../api/api.js';

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

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
        actions.buyBooster(this.props.booster.id);
    },
    componentWillReceiveProps: function () {
        this.setState({
            loading: false
        });;
    },
    render: function () {
        var {
            name, duration, text, image,
            points, type, fill
        } = this.props.booster;

        var userPoints   = this.props.userPoints || 0;
        var enoughPoints = points <= userPoints;

        var buttonText = {
            false: <span>{t.boosterPage.buyFor} {points} {t.label.points}</span>,
            true: <span>{t.label.booster} {t.label.active}</span>
        }[this.props.disable];

        if (!this.props.disable && !enoughPoints) {
            buttonText = <span>{t.boosterPage.missing} {points - userPoints} {t.label.points}</span>;
        }

        var _active;

        if (this.props.active) {
            _active = <strong>{t.boosterPage.isActive}</strong>;
        }

        var body = (
            <div>
                <div>
                    <h5>{name}</h5>
                    <hr />
                    <p>
                        {text} {_active}
                    </p>
                </div>
                <div className='pull-right'>
                    <Button
                        bsStyle={!enoughPoints ? 'alert' : 'success'}
                        disabled={this.props.disable || !enoughPoints}
                        active={this.props.active}
                        onClick={this.buyBooster}
                        >
                        {buttonText}
                    </Button>
                </div>
            </div>
        );

        var icon = (
            <Icon
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
            return <BoosterComponent
                key={b.id}
                disable={this.state.booster.isActive}
                userPoints={this.state.alltime.user.points.all}
                active={active}
                booster={b}
            />
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
                <strong><h3>{t.boosterPage.timeLeft} {this.state.left.format('hh:mm:ss')}</h3></strong>
            );
        }

        return (
            <Grid>
                <Row>
                    <Col xs={12}>
                        <h1>{t.boosterPage.header}</h1>
                        <hr/>
                        <p>{t.boosterPage.subHeader}</p>
                        <p>{this.state.alltime.user.booster.length} {t.boosterPage.bought}</p>
                        {_booster}
                    </Col>
                    <ReactCSSTransitionGroup transitionName="fade" transitionAppear={true} transitionEnter={true}>
                        {this.createBooster()}
                    </ReactCSSTransitionGroup>
                </Row>
            </Grid>
        );
    }
});
