import React                from 'react/addons';
import _                    from 'lodash';
import Reflux               from 'reflux';
import {
    Grid, Row, Col, Input, Button,
    Jumbotron, Alert, PageHeader, Badge,
    Table, Well
}                           from 'react-bootstrap';

import gameStore            from '../../stores/game.js';
import {user, requireAuth}  from '../../auth.js';

import BADGES               from '../../../shared/gamification/badges.js';
import LEVELS               from '../../../shared/gamification/levels.js';
import t                    from '../../../shared/translations/translation.js';

import BarChart             from '../charts/barChart.js';
import Icon                 from '../utility/icon.js';
import IconCard             from '../utility/iconcard.js';

import LeaderBoard          from './leaderboard.js';

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;


var BadgeComponent = React.createClass({
    render: function () {
        var {
            number, name, text,
            points, image, name,
            type, fill, image
        } = this.props.badge;

        var body = (
            <span>
                <h5>{number} {name}</h5>
                <hr />
                <p>
                    {text}
                    <br/>
                    <strong>{points}</strong> {t.badgesPage.badges.points}
                </p>
            </span>
        );

        var icon = (
            <Icon
                image={image}
                type={type}
                fill={fill}
            />
        );

        return (
            <IconCard body={body} icon={icon}/>
        );

    }
});

export default React.createClass({
    displayName: 'badges',
    mixins: [
        Reflux.connect(gameStore),
    ],
    render: function () {

        var userBadges = this.state.alltime.user.badges.map(t => {
            return _.find(BADGES, {id : t.id});
        });

        var badgeComponents = _.sortBy(userBadges, 'fill')
            .map(x => <BadgeComponent key={x.id} badge={x}/>);

        var user = this.state.alltime.user;

        var data = [
            {
                y: t.label.vote,
                x: _.get(user.actions, ['vote', 'down', 'points'], 0) +
                   _.get(user.actions, ['vote', 'up', 'points'], 0)
            },

            {
                y: t.label.favourite,
                x: _.get(user.actions, ['favourite', 'toggle', 'points'], 0)
            },

            {
                y: t.label.login,
                x: _.get(user.actions, ['auth', 'login', 'points'], 0)
            },

            {
                y: t.label.query,
                x: _.get(user.actions, ['query', 'add', 'points'], 0)
            },
            {
                y: t.label.badge,
                x: _.get(user, '.points.badges', 0)
            }

        ].sort((a, b) => b.x - a.x);

        var points = this.state.alltime.user.points.all;
        // works because LEVELS is an array and the current level
        // is the indice for the next one
        var pointsNeededForNextLevel = LEVELS[this.state.level].points - points;

        return (
            <Grid>
                <Row>
                    <Col xs={12}>
                        <h1>{points} {t.label.points} / {this.state.level} {t.label.level}</h1>
                        <p>{pointsNeededForNextLevel} {t.badgesPage.nextLevel}</p>
                        <BarChart data={data}/>
                    </Col>
                    <Col xs={12}>
                        <PageHeader>
                            <h1>{t.badgesPage.badges.header}</h1>
                            <hr/>
                            <p>
                                {t.badgesPage.badges.subHeader}
                                <br/>
                                <strong>{userBadges.length}</strong> {t.badgesPage.badges.collected}
                            </p>
                        </PageHeader>
                    </Col>
                    <ReactCSSTransitionGroup transitionName="fade" transitionAppear={true} transitionEnter={true}>
                        {badgeComponents}
                    </ReactCSSTransitionGroup>
                    <Col xs={12}>
                        <h1>{t.leaderboard.header}</h1>
                        <hr/>
                        <Row>
                            <Col xs={12} md={6}>
                                <h3>{t.leaderboard.alltime}</h3>
                                <LeaderBoard users={this.state.alltime.users} user={this.state.alltime.user}/>
                            </Col>
                            <Col xs={12} md={6}>
                                <h3>{t.leaderboard.monthly}</h3>
                                <LeaderBoard users={this.state.monthly.users} user={this.state.monthly.user}/>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Grid>
        );
    }
});
