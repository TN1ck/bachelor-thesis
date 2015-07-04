import React       from 'react';
import Reflux      from 'reflux';
import {
    Grid, Row, Col, Input, Button,
    Jumbotron, Alert, PageHeader
}                  from 'react-bootstrap';

import gameStore   from '../../stores/game.js';
import BarChart    from '../charts/barChart.js';
import LeaderBoard from '../trophies/leaderboard.js';

import t from '../../../shared/translations/translation.js';

export default React.createClass({
    mixins: [
        Reflux.connect(gameStore),
    ],
    render: function () {
        console.log(t, t.badgesPage, 'BADGESPAGE');
        return (
            <Row>
                <Col xs={12} sm={12} md={4}>
                    <h1>{t.badgesPage.leaderboard.header}</h1>
                    <hr/>
                    <Row>
                        <Col md={12} lg={6}>
                            <h3>{t.badgesPage.leaderboard.alltime}</h3>
                            <LeaderBoard users={this.state.alltime.users}/>
                        </Col>
                        <Col md={12} lg={6}>
                            <h3>{t.badgesPage.leaderboard.monthly}</h3>
                            <LeaderBoard users={this.state.monthly.users}/>
                        </Col>
                    </Row>
                </Col>
                <Col xs={12} sm={12} md={4}>
                    <h1>Punkte</h1>
                    <hr/>
                </Col>
                <Col xs={12} sm={12} md={4}>
                    <h1>Aktionen</h1>
                    <hr/>
                </Col>
            </Row>
        );
    }
})
