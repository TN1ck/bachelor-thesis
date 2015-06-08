import React  from 'react/addons';
import _      from 'lodash';
import Reflux from 'reflux';
import {
    Grid, Row, Col, Input, Button,
    Jumbotron, Alert, PageHeader, Badge
} from 'react-bootstrap';


import actions             from '../../actions.js';
import {SETTINGS}          from '../../settings.js';
import gameStore           from '../../stores/game.js';
import {camelCaseToBar}    from '../../utils.js';
import {user, requireAuth} from '../../auth.js';

import { badges } from '../../badges.js';

// import {ReactSourceSelect, ReactSource} from './sources.js';

import { Award } from './awards.js';
import {Banner} from './banner.js';

var LeaderBoard = React.createClass({
    render: function () {
        var users = this.props.users;

        var list = users.sort((a, b) => {
            return b.trophies.points - a.trophies.points;
        }).map((user, i) => {
            var {results, trophies, points} = user.trophies;
            var name = user.user;

            return <li><span>#{i}</span> - {name} - {points}</li>;
        });

        return (
            <ul>
                {list}
            </ul>
        );
    }
});

export var ReactTrophies = React.createClass({
    displayName: 'badges',
    mixins: [
        Reflux.connect(gameStore),
    ],
    onStoreChange: function (state) {
        console.log(state);
        this.setState({
            monthly: state.monthly,
            alltime: state.alltime
        })
    },
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
                            <p><strong>56.6%</strong> aller Benutzer besitzen diese Trophäe.</p>
                        </div>
                    </div>
                </Col>
            );
        });

        return (
            <Grid>
                <Row>
                    <Col xs={12}>
                        <h1>Bestenliste</h1>
                        <hr/>
                    </Col>
                    <Col xs={12} md={6}>
                        <h3>Aller Zeiten</h3>
                        <LeaderBoard users={this.state.alltime.users} user={this.state.alltime.user}/>
                    </Col>
                    <Col xs={12} md={6}>
                        <h3>Letzter Monat</h3>
                        <LeaderBoard users={this.state.monthly.users} user={this.state.monthly.user}/>
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
