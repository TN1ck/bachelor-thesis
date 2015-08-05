import React       from 'react';
import Reflux      from 'reflux';
import {Row, Col}  from 'react-bootstrap';

import t           from '../../../shared/translations/translation.js';
import gameStore   from '../../stores/game.js';
import BarChart    from '../charts/barChart.js';
import LeaderBoard from '../badges/leaderboard.js';
import Action      from './action.js';

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

/**
 * The stats-page
 */
export default React.createClass({
    displayName: 'StatsPage',

    mixins: [Reflux.connect(gameStore)],

    /**
     * Creates a barchart which shows the point-distribution of all users
     */
    createBarChart: function () {

        var alltime = this.state.alltime;

        var data = [
            {
                y: t.label.vote,
                x: _.get(alltime.actions, ['vote', 'down', 'points'], 0) +
                   _.get(alltime.actions, ['vote', 'up', 'points'], 0)
            },

            {
                y: t.label.favourite,
                x: _.get(alltime.actions, ['favourite', 'toggle', 'points'], 0)
            },

            {
                y: t.label.login,
                x: _.get(alltime.actions, ['auth', 'login', 'points'], 0)
            },

            {
                y: t.label.query,
                x: _.get(alltime.actions, ['query', 'add', 'points'], 0)
            },
            {
                y: t.label.badge,
                x: alltime.badges.all.points
            }

        ].sort((a, b) => b.x - a.x);

        return (
            <Col xs={12} sm={12} md={3}>
                <h1>{alltime.points} Punkte</h1>
                <hr/>
                <BarChart data={data}/>
            </Col>
        );

    },

    /**
     * Creats the infinite leaderboards
     */
    createLeaderBoards: function () {

        var alltime = this.state.alltime;
        var monthly = this.state.monthly;

        return (
            <Col xs={12} sm={12} md={6}>
                <h1>{t.leaderboard.header}</h1>
                <hr/>
                <Row>
                    <Col md={12} lg={6}>
                        <h3>{t.leaderboard.alltime}</h3>
                        <LeaderBoard users={alltime.users}/>
                    </Col>
                    <Col md={12} lg={6}>
                        <h3>{t.leaderboard.monthly}</h3>
                        <LeaderBoard users={monthly.users}/>
                    </Col>
                </Row>
            </Col>
        );
    },

    /**
     * Visualize the last actions performed by the user
     */
    createActions: function () {
        var actions = this.state.actions;
        var _actions = actions.map(action => {
            return (
                <Row key={action.action.id}>
                    <Action action={action} />
                </Row>
            );
        });

        return (
            <Col xs={12} sm={12} md={3}>
                <h1>Aktionen</h1>
                <hr/>
                <ReactCSSTransitionGroup transitionName="fade" transitionAppear={true} transitionEnter={true}>
                    {_actions}
                </ReactCSSTransitionGroup>
            </Col>
        );
    },

    render: function () {
        return (
            <Row>
                {this.createLeaderBoards()}
                {this.createBarChart()}
                {this.createActions()}
            </Row>
        );
    }
})
