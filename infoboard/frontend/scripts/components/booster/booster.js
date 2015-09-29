import React               from 'react/addons';
import Reflux              from 'reflux';
import moment              from 'moment';
// we need to import moment-duration-format to display the time-left for the booster
import duration            from 'moment-duration-format';

import gameStore           from '../../stores/game.js';
import actions             from '../../actions/actions.js';

import IconCard            from '../utility/iconcard.js';
import Icon                from '../utility/icon.js';

import BOOSTER             from '../../../shared/gamification/booster.js';

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

import {
    Grid,
    Row,
    Col,
    Button
}                          from 'react-bootstrap';

/**
 * Provides all the functionality of showing and buying a booster
 */
var BoosterComponent = React.createClass({
    displayName: 'Booster',

    propTypes: {
        booster: React.PropTypes.object,
        userPoints: React.PropTypes.number,
        active: React.PropTypes.bool
    },

    getInitialState: function () {
        return {
            loading: false
        };
    },

    buyBooster: function () {
        // show a loding indicitor as long as the request is running
        this.setState({loading: true});
        actions.buyBooster(this.props.booster.id);
    },

    componentWillReceiveProps: function () {
        // request finished, turn off the loading
        this.setState({loading: false});
    },

    render: function () {

        var t = this.props.translation;

        var {
            name, text, image,
            points, type, fill
        } = this.props.booster;

        var userPoints   = this.props.userPoints || 0;
        var enoughPoints = points <= userPoints;

        var buttonText = <span>{t.boosterPage.buyFor} {points} {t.label.points}</span>;

        /* the user cannot buy new boosters if he does not have enough points or
           has another booster currently active */
        if (!enoughPoints) {
            buttonText = <span>{t.boosterPage.missing} {points - userPoints} {t.label.points}</span>;
        }

        var _active;

        // this is the booster the user is currently using, visualize this
        if (this.props.active) {
            _active = <strong>{t.boosterPage.isActive}</strong>;
        }

        var body = (
            <div>
                <div>
                    <h5>{_.get(t, name)}</h5>
                    <hr />
                    <p>
                        {_.get(t, text)} {_active}
                    </p>
                </div>
                <div className='pull-right'>
                    <Button
                        bsStyle={!enoughPoints ? 'alert' : 'success'}
                        disabled={!enoughPoints}
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
    displayName: 'BoosterPage',

    mixins: [Reflux.listenTo(gameStore, 'onStoreChange')],

    getInitialState: function () {
        var state = gameStore.state;
        var booster = this.calcBooster(state);
        return _.extend({}, gameStore.state, {
            booster: booster,
            left: this.calcTimeLeft(booster)
        });
    },

    onStoreChange: function (state) {
        var booster = this.calcBooster(state);
        this.setState(_.extend(state, {
            booster: booster,
            left: this.calcTimeLeft(booster)
        }));
    },

    /**
     * Takes the state and returns a dictionary that holds the currently active
     * Booster (only when there is an active Booster) and how long it will stay
     * active
     *
     * @param {Object} state The current state
     * @returns {{isActive: Boolean, last: Object, validUntil: Duration}}
     */
    calcBooster: function (state) {

        var b = {
            isActive: false
        };

        var userBooster = state.alltime.user.booster;
        var lastBooster = _.last(_.sortBy(userBooster, _b => _b.createdAt));

        if (lastBooster) {
            var validUntil = moment(lastBooster.validUntil);
            var boosterIsActive = moment().isBefore(validUntil);
            b.validUntil = validUntil;
            b.isActive = boosterIsActive;
            b.booster = lastBooster;
        }

        return b;
    },

    /**
     * Calculates the duration the given Booster will stay active
     *
     * @param {Object} booster The Booster w
     * @returns {Duration}
     */
    calcTimeLeft: function (booster) {
        var left = moment.duration(moment(booster.validUntil).diff(moment()));
        return left;
    },

    /**
     * Creates a Booster Component for every `Booster` in `BOOSTERS`
     *
     * @returns {Component}
     */
    createBoosters: function () {
        return BOOSTER.map(b => {
            // mark the booster as active if he is the last on purchased and is still active
            var active = _.get(this.state.booster, '.booster.name') === b.id
                         && this.state.booster.isActive;
            return (
                <BoosterComponent
                    translation={this.props.translation}
                    key={b.id}
                    userPoints={this.state.alltime.user.points.all}
                    active={active}
                    booster={b}
                />
            );
        });
    },

    componentDidMount: function () {
        // update the time left counter every 0.5s
        this.interval = setInterval(() => {
            var left = this.calcTimeLeft(this.state.booster);
            this.setState({
                left: left
            });
        }, 500);
    },

    componentWillUnmount: function () {
        // clear the interval when the component is removed
        clearInterval(this.interval);
    },

    render: function () {

        var timeLeft;
        var t = this.props.translation;

        if (this.state.booster.isActive) {
            timeLeft = (
                <strong>
                    <h3>{t.boosterPage.timeLeft} {this.state.left.format('hh:mm:ss')}</h3>
                </strong>
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
                        {timeLeft}
                    </Col>
                    <ReactCSSTransitionGroup transitionName="fade" transitionAppear={true} transitionEnter={true}>
                        {this.createBoosters()}
                    </ReactCSSTransitionGroup>
                </Row>
            </Grid>
        );
    }
});
