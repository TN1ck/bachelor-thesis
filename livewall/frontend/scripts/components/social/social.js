import React       from 'react';
import Reflux      from 'reflux';
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
import {
    Grid, Row, Col, Input, Button,
    Jumbotron, Alert, PageHeader
}                  from 'react-bootstrap';

import gameStore   from '../../stores/game.js';
import BarChart    from '../charts/barChart.js';
import LeaderBoard from '../badges/leaderboard.js';

import t from '../../../shared/translations/translation.js';
import {colors} from '../../../shared/util/colors.js';

import Action from './action.js';

export default React.createClass({
    mixins: [
        Reflux.connect(gameStore),
    ],
    render: function () {

        var alltime = this.state.alltime;
        var monthly = this.state.monthly;
        var actions = this.state.actions;

        var data = [
            {
                y: t.badgesPage.label.vote,
                x: _.get(alltime.actions, ['vote', 'down', 'points'], 0) +
                   _.get(alltime.actions, ['vote', 'up', 'points'], 0)
            },

            {
                y: t.badgesPage.label.favourite,
                x: _.get(alltime.actions, ['favourite', 'toggle', 'points'], 0)
            },

            {
                y: t.badgesPage.label.login,
                x: _.get(alltime.actions, ['auth', 'login', 'points'], 0)
            },

            {
                y: t.badgesPage.label.query,
                x: _.get(alltime.actions, ['query', 'add', 'points'], 0)
            },
            {
                y: t.badgesPage.label.badge,
                x: alltime.badges.all.points
            }

        ].sort((a, b) => b.x - a.x);

        var _actions = actions.map(action => {
            return (
                <Row key={action.action.id}>
                    <Action action={action} />
                </Row>
            );
        });

        return (
            <Row>
                <Col xs={12} sm={12} md={6}>
                    <h1>{t.badgesPage.leaderboard.header}</h1>
                    <hr/>
                    <Row>
                        <Col md={12} lg={6}>
                            <h3>{t.badgesPage.leaderboard.alltime}</h3>
                            <LeaderBoard users={alltime.users}/>
                        </Col>
                        <Col md={12} lg={6}>
                            <h3>{t.badgesPage.leaderboard.monthly}</h3>
                            <LeaderBoard users={monthly.users}/>
                        </Col>
                    </Row>
                </Col>
                <Col xs={12} sm={12} md={3}>
                    <h1>{alltime.points} Punkte</h1>
                    <hr/>
                    <BarChart data={data}/>
                </Col>
                <Col xs={12} sm={12} md={3}>
                    <h1>Aktionen</h1>
                    <hr/>
                    <ReactCSSTransitionGroup transitionName="fade" transitionAppear={true} transitionEnter={true}>
                        {_actions}
                    </ReactCSSTransitionGroup>
                </Col>
            </Row>
        );
    }
})
