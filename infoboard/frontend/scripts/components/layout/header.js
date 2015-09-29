import React     from 'react/addons';
import Reflux    from 'reflux';
import gameStore from '../../stores/game.js';
import userStore from '../../stores/user.js';
import SETTINGS  from '../../settings.js';

import {
    Nav, Navbar,
    CollapsibleNav,
} from 'react-bootstrap';
import {NavItemLink} from 'react-router-bootstrap';

/**
 * Navigation Tab for the user-statistics
 */
var UserStatsNav = React.createClass({

    displayName: 'UserStatsNav',

    propTypes: {
        user: React.PropTypes.object
    },

    mixins: [
        Reflux.connect(gameStore)
    ],

    render: function () {
        var alltime = this.state.alltime.user;
        var level   = this.state.level;

        var t = this.props.translation;

        return (
            <Nav navbar>
                <NavItemLink to='badges' active={false}>
                    <span>{this.props.user.username} - {alltime.points.all} {t.label.points}</span>
                    <span> - #{alltime.place} {t.label.place} - {level} {t.label.level}</span>
                </NavItemLink>
            </Nav>
        );
    }
});

/**
 * The Header of the application, serves as a navigation and info about the current
 * user-statistics
 */
export default React.createClass({
    displayName: 'Header',

    mixins: [
        Reflux.connect(userStore)
    ],

    /**
     * Creates all links in the header, will show different links according to
     * the state of the user-authentication
     * @returns {Component}
     */
    createLinks: function () {

        var t = this.props.translation;

        var style = {lineHeight: 0};
        var isLoggedIn = this.state.user.isLoggedIn();

        /* The links that will be shown, if the restricted-flag is set, the link
            won't be shown if the user isn't authenticated */
        var links = [
            {
                name: t.label.brand,
                link: 'wall',
                restricted: true
            },
            {
                name: (
                    <span>
                        <i style={style} className='fa fa-gears'></i> {t.label.settings}
                    </span>
                ),
                link: 'settings',
                restricted: true
            },
            {
                name: (
                    <span>
                        <i style={style} className='fa fa-trophy'></i> {t.label.badges}
                    </span>
                ),
                link: 'badges',
                restricted: true
            },
            {
                name: (
                    <span>
                        <i style={style} className='fa fa-dollar'></i> {t.label.booster}
                    </span>
                ),
                link: 'booster',
                restricted: true
            },
            {
                name: (
                    <span>
                        <i style={style} className='fa fa-bar-chart'></i> {t.label.stats}
                    </span>
                ),
                link: 'stats',
                restricted: true
            },
            {
                name: isLoggedIn ? t.label.logout : t.label.login,
                link: isLoggedIn ? 'logout' : 'login'
            }
        ];

        // create the links depending on the state of the user-authentication
        var nav = links.filter(l => {
            return !l.restricted || isLoggedIn;
        }).map((link) => {
            return <NavItemLink key={link.link} to={link.link}>{link.name}</NavItemLink>;
        });

        return (
            <Nav navbar right>
                {nav}
            </Nav>
        );
    },

    /**
     * Creates the user-info, were his current points, his level and his position
     * are shown
     * @returns {Component}
     */
    createUser: function () {
        if (this.state.user.isLoggedIn()) {
            return <UserStatsNav translation={this.props.translation} user={this.state.user}/>;
        }
        return <span></span>;
    },

    render: function () {

        // hide the header if its set in the settings
        if (SETTINGS.HIDE_HEADER) {
            return <span></span>;
        }

        return (
            <Navbar fluid inverse toggleNavKey={0}>
                <CollapsibleNav eventKey={0}>
                    {this.createUser()}
                    {this.createLinks()}
                </CollapsibleNav>
            </Navbar>
        );
    }
});
