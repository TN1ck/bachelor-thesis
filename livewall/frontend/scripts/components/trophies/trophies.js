import React                from 'react/addons';
import _                    from 'lodash';
import Reflux               from 'reflux';
import {
    Grid, Row, Col, Input, Button,
    Jumbotron, Alert, PageHeader, Badge,
    Table, Well
}                           from 'react-bootstrap';


import SETTINGS             from '../../settings.js';
import gameStore            from '../../stores/game.js';
import {user, requireAuth}  from '../../auth.js';


import BarChart             from '../charts/barChart.js';

import Award                from './awards.js';
import LeaderBoard          from './leaderboard.js';
import IconCard             from '../utility/iconcard.js';

import badges               from '../../../shared/gamification/badges.js';
import {camelCaseToBar}     from '../../../shared/util/utils.js';

import t                    from '../../../shared/translations/translation.js';

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
            <Award
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
            return _.find(badges, {id : t.name});
        });

        var badgeComponents = userBadges.map(x => <BadgeComponent badge={x}/>);

        var user = this.state.alltime.user;

        var getActionPoints = (actions, group, label) => {
            return (_.find(actions, {group: group, label: label}) || {points: 0}).points;
        };

        var data = [
            {
                y: t.badgesPage.label.vote,
                x: getActionPoints(user.actions, 'vote', 'down') +
                   getActionPoints(user.actions, 'vote', 'up')
            },

            {
                y: t.badgesPage.label.favourite,
                x: getActionPoints(user.actions, 'favourite', 'toggle')
            },

            {
                y: t.badgesPage.label.login,
                x: getActionPoints(user.actions, 'auth', 'login')
            },

            {
                y: t.badgesPage.label.search,
                x: getActionPoints(user.actions, 'search', 'add')
            },
            {
                y: t.badgesPage.label.badge,
                x: user.points.badges
            }

        ].sort((a, b) => b.x - a.x);

        return (
            <Grid>
                <Row>
                    <Col xs={12}>
                        <h1>{this.state.alltime.user.points.all} Punkte</h1>
                        <BarChart data={data}/>
                    </Col>
                    <Col xs={12}>
                        <h1>{t.badgesPage.leaderboard.header}</h1>
                        <hr/>
                    </Col>
                    <Col xs={12}>
                        <Row>
                            <Col xs={12} md={6}>
                                <h3>{t.badgesPage.leaderboard.alltime}</h3>
                                <LeaderBoard users={this.state.alltime.users} user={this.state.alltime.user}/>
                            </Col>
                            <Col xs={12} md={6}>
                                <h3>{t.badgesPage.leaderboard.monthly}</h3>
                                <LeaderBoard users={this.state.monthly.users} user={this.state.monthly.user}/>
                            </Col>
                        </Row>
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
                    {badgeComponents}
                </Row>
            </Grid>
        );
    }
});
