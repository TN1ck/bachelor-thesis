import React from 'react';
import Reflux from 'reflux';
import {
    Grid, Row, Col, Input, Button,
    Jumbotron, Alert, PageHeader
} from 'react-bootstrap';

import gameStore from '../../stores/game.js';
import BarChart from '../charts/barChart.js';
import LeaderBoard from '../trophies/leaderboard.js';

module.exports = React.createClass({
    mixins: [
        Reflux.connect(gameStore),
    ],
    render: function () {

        return (
            <Row>
                <Col md={4}>
                    <h1>Bestenlisten</h1>
                    <hr/>
                    <Row>
                        <Col xs={12} md={6}>
                            <h3>Aller Zeiten</h3>
                            <LeaderBoard users={this.state.alltime.users}/>
                        </Col>
                        <Col xs={12} md={6}>
                            <h3>Letzter Monat</h3>
                            <LeaderBoard users={this.state.monthly.users}/>
                        </Col>
                    </Row>
                </Col>
                <Col md={4}>
                    <h1>Punkte</h1>
                    <hr/>
                </Col>
                <Col md={4}>
                    <h1>Aktionen</h1>
                    <hr/>
                </Col>
            </Row>
        );
    }
})
