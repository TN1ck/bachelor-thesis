import React                from 'react/addons';
import _                    from 'lodash';
import Reflux               from 'reflux';
import {
    Grid,
    Row,
    Col,
    PageHeader,
    Input
}                           from 'react-bootstrap';

import gameStore            from '../../stores/game.js';

import BADGES               from '../../../shared/gamification/badges.js';
import LEVELS               from '../../../shared/gamification/levels.js';
import t                    from '../../../shared/translations/translation.js';

import BarChart             from '../charts/barChart.js';
import Icon                 from '../utility/icon.js';
import IconCard             from '../utility/iconcard.js';

import LeaderBoard          from './leaderboard.js';

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

/**
 * Creates a Badge
 */
var BadgeComponent = React.createClass({
    displayName: 'Badge',

    propTypes: {
        badge: React.PropTypes.object
    },

    render: function () {
        var {
            number, name, text,
            points, image,
            type, fill
        } = this.props.badge;

        var pointsText = this.props.owns ? t.userstats.badges.points : t.userstats.badges.pointsWill;

        var body = (
            <span>
                <h5>{number} {name}</h5>
                <hr />
                <p>
                    {text}
                    <br/>
                    <strong>{points}</strong> {pointsText}
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
            <IconCard active={this.props.owns} body={body} icon={icon}/>
        );

    }
});

/**
 * Page for the userstats
 */
export default React.createClass({
    displayName: 'UserStats',

    mixins: [Reflux.connect(gameStore)],

    getInitialState: function () {
        return {
            showAllBadges: false
        };
    },

    /**
     * Creates a barchart which shows the point-distribution of the user
     * @returns {Component}
     */
    createBarChart: function () {

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

        return <BarChart data={data}/>;
    },

    render: function () {

        var userBadges = BADGES.filter(b => {
            if (this.state.showAllBadges) {
                return true;
            }
            return _.find(this.state.alltime.user.badges, {
                id: b.id
            });
        });

        // create Badges and sort them by color
        var badgeComponents = _.sortBy(userBadges, 'fill')
            .map(x => {
                var owns = _.find(this.state.alltime.user.badges, {
                    id: x.id
                });
                return <BadgeComponent key={x.id} owns={owns} badge={x}/>;
            });

        var points = this.state.alltime.user.points.all;

        /* works because LEVELS is an array and the current level
           is the indice for the next one */
        var pointsForNextLevel = _.get(LEVELS, [this.state.level, 'points'], 0);
        // If the maximum level is reached, the points needed are 0
        var pointsNeededForNextLevel = Math.max(0, pointsForNextLevel - points);

        return (
            <Grid>
                <Row>
                    <Col xs={12}>
                        <h1>{points} {t.label.points} / {this.state.level} {t.label.level}</h1>
                        <p>{pointsNeededForNextLevel} {t.userstats.nextLevel}</p>
                        {this.createBarChart()}
                    </Col>
                    <Col xs={12}>
                        <PageHeader>
                            <h1>{t.userstats.badges.header}</h1>
                            <hr/>
                            <p>
                                {t.userstats.badges.subHeader}
                                <br/>
                                <strong>
                                    {this.state.alltime.user.badges.length}
                                    /
                                    {BADGES.length}
                                </strong>
                                <span> {t.userstats.badges.collected}</span>
                            </p>
                            <Input
                                onChange={() => this.setState({showAllBadges: !this.state.showAllBadges}) }
                                type='checkbox'
                                hasFeedback
                                checked={this.state.showAllBadges}
                                label={t.userstats.showAllBadges}
                                ref='remember'
                            />
                        </PageHeader>
                    </Col>
                        {badgeComponents}
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
