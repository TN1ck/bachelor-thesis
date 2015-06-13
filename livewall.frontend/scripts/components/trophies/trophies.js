import React  from 'react/addons';
import _      from 'lodash';
import Reflux from 'reflux';
import {
    Grid, Row, Col, Input, Button,
    Jumbotron, Alert, PageHeader, Badge,
    Table, Well
} from 'react-bootstrap';


import {SETTINGS}          from '../../settings.js';
import gameStore           from '../../stores/game.js';
import {camelCaseToBar}    from '../../util/utils.js';
import {user, requireAuth} from '../../auth.js';

import { badges }          from '../../gamification/badges.js';

import BarChart from '../charts/barChart.js';

// import {ReactSourceSelect, ReactSource} from './sources.js';

import Award       from './awards.js';
import LeaderBoard from './leaderboard.js';

export var ReactTrophies = React.createClass({
    displayName: 'badges',
    mixins: [
        Reflux.connect(gameStore),
    ],
    render: function () {

        var badgeComponents = badges.map(x => {
            return (
                <Col xs={12} md={12}>
                    <div className='trophies__trophy__container'>
                        <div className='trophies__trophy__svg-container'>
                            <Award image={x.image} text={x.name} number={x.number} type={x.type} fill={x.fill}/>
                        </div>
                        <div className='trophies__trophy__text-container'>
                            <h5>
                                {x.number} {x.name}
                            </h5>
                            <hr />
                            <p>
                            {x.text}
                            <br/>
                            Du hast Für diese Trophäe <strong>{x.points}</strong> Punkte erhalten.
                            </p>
                        </div>
                    </div>
                </Col>
            );
        });

        console.log(this.state.alltime.user);

        var points = this.state.alltime.user.trophies.points || {};

        var data = [
            {
                y: 'bewerten',
                x: points.vote || 0
            },

            {
                y: 'favorisieren',
                x: points.favourite || 0
            },

            {
                y: 'einloggen',
                x: points.auth || 0
            },

            {
                y: 'suchen',
                x: points.search || 0
            },
            {
                y: 'Trophäen',
                x: points.trophies || 0
            }

        ].sort((a, b) => b.x - a.x);

        return (
            <Grid>
                <Row>
                    <Col xs={12}>
                        <h1>{this.state.alltime.user.trophies.points.all} Punkte</h1>
                        <BarChart data={data}/>
                        <hr/>
                    </Col>
                    <Col xs={12}>
                        <h1>Bestenliste</h1>
                        <hr/>
                    </Col>
                    <Col xs={12}>
                        <Row>
                            <Col xs={12} md={6}>
                                <h3>Aller Zeiten</h3>
                                <LeaderBoard users={this.state.alltime.users} user={this.state.alltime.user}/>
                            </Col>
                            <Col xs={12} md={6}>
                                <h3>Letzter Monat</h3>
                                <LeaderBoard users={this.state.monthly.users} user={this.state.monthly.user}/>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={12}>
                        <PageHeader>
                            <h1>Trophäen</h1>
                            <hr/>
                            <p>Hier Findest du alle Trophäen die du bekommen hast, durch jede Trophäe werden dir Punkte auf deinen Punktestand gutgeschrieben.</p>
                        </PageHeader>
                    </Col>
                    {badgeComponents}
                </Row>
            </Grid>
        );
    }
});
