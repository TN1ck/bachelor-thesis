import React  from 'react/addons';
import _      from 'lodash';
import Reflux from 'reflux';
import {
    Grid, Row, Col, Input, Button,
    Jumbotron, Alert, PageHeader, Badge,
    Table, Well
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
        var _user = this.props.user;

        //
        // remove user, sort and take only the 50 best, add the user again
        //

        // remove user
        //

        users = users.filter(x => {
            return x.user !== user.username;
        });

        var sortFn = (a, b) => b.trophies.points - a.trophies.points;

        // sort and take best 20

        users = users.sort(sortFn).slice(0, 20);

        // add user
        users = users.concat([_user]).sort(sortFn);

        users.sort((a, b) => {
            return b.trophies.points - a.trophies.points;
        })

        var list = users.map(_user => {
            var {results, trophies, points, place} = _user.trophies;

            trophies = _.chain(trophies).map(x => {
                return _.find(badges, {id: x});
            }).sortBy(x => -x.points).value();

            var name = _user.user;

            var _trophies = trophies.map(x => {
                return <div className='trophies__leaderboard__trophies__container'>
                    <Award
                        center={true}
                        image={x.image}
                        text={x.name}
                        number={x.number}
                        type={x.type}
                        fill={x.fill}/>
                    </div>;
            });

            _trophies = trophies.length;

            var trClass = ''

            if (name === user.username) {
                trClass = 'active';
            }

            return <tr className={trClass}>
                <td className='vert-align trophies__leaderboard__place'    xs={3}>#{_user.place}</td>
                <td className='vert-align trophies__leaderboard__name'     xs={3}>{name}</td>
                <td className='vert-align trophies__leaderboard__points'   xs={3}>{points}</td>
                <td className='vert-align trophies__leaderboard__trophies' xs={3}>{_trophies}</td>
            </tr>;
        });

        return (
            <Table className='trophies__leaderboard' hover striped>
                <thead>
                    <tr>
                        <th>Platz</th>
                        <th>Name</th>
                        <th>Punkte</th>
                        <th>Trophäen</th>
                    </tr>
                </thead>
                <tbody>
                {list}
                </tbody>
            </Table>
        );
    }
});

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

        return (
            <Grid>
                <Row>
                    <Col xs={12}>
                        <PageHeader>
                            <h1>Bestenliste</h1>
                            <hr/>
                        </PageHeader>
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
