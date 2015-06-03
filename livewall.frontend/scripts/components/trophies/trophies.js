import React from 'react/addons';
import { Grid, Row, Col, Input, Button, Jumbotron, Alert, PageHeader, Badge } from 'react-bootstrap';

import _ from 'lodash';

import actions from '../../actions.js';
import {SETTINGS} from '../../settings.js';
import {gameStore} from '../../stores/game.js';
import {camelCaseToBar} from '../../utils.js';
import {user, requireAuth} from '../../auth.js';

import { badges } from '../../badges.js';

// import {ReactSourceSelect, ReactSource} from './sources.js';

import { Award } from './awards.js';
import {Banner} from './banner.js';

export var ReactTrophies = React.createClass({
    displayName: 'badges',
    render: function () {

        var randomPoints = _.range(15).map(d => {
            var points = _.random(100, 20000);
            return <div className='trophies__points__splitted'>
                <span className='trophies__points__splitted__points'>{points} Punkte</span>
                <span className='trophies__points__splitted__text'> durch {Math.round(points/100)} Aktionen</span>
            </div>;
        });

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
                            <p>{x.text}</p>
                            <p><strong>56.6%</strong> besitzen diese Trophäe.</p>
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
                            <h1>Trophäen</h1>
                            <hr/>
                            <p>Hier Findest du alle Trophäen die du bekommen hast, durch jede Trophäe werden dir Punkte auf deinen Punktestand gutgeschrieben.</p>
                        </PageHeader>
                    </Col>
                    {badgeComponents}
                    <Col xs={12}>
                        <h1> Punkte </h1>
                        <hr/>
                    </Col>
                </Row>
            </Grid>
        );
    }
});
