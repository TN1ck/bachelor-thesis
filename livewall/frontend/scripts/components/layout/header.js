import React     from 'react/addons';
import Reflux    from 'reflux';
import {Link}    from 'react-router';
import gameStore from '../../stores/game.js';
import userStore from '../../stores/user.js';
import SETTINGS  from '../../settings.js';

import {
    Nav, Navbar,
    DropdownButton,
    MenuItem,
    NavItem,
    CollapsibleNav,
    Badge
} from 'react-bootstrap';
import {NavItemLink} from 'react-router-bootstrap';

import t from '../../../shared/translations/translation.js';

export default React.createClass({
    displayName: 'header',
    mixins: [
        Reflux.connect(gameStore),
        Reflux.connect(userStore)
    ],
    createLinks: function () {
        var style = {lineHeight: 0};
        var isLoggedIn = this.state.user.isLoggedIn();

        var links = [
            {
                name: t.label.brand,
                link: 'wall',
                restricted: true
            },
            {
                name: <span>
                    <i style={style} className='fa fa-gears'></i> {t.label.settings}
                    </span>,
                link: 'settings',
                restricted: true
            },
            {
                name: <span>
                    <i style={style} className='fa fa-trophy'></i> {t.label.badges}
                </span>,
                link: 'badges',
                restricted: true
            },
            {
                name: <span>
                    <i style={style} className='fa fa-dollar'></i> {t.label.booster}
                </span>,
                link: 'booster',
                restricted: true
            },
            {
                name: <span>
                    <i style={style} className='fa fa-bar-chart'></i> {t.label.stats}
                </span>,
                link: 'stats',
                restricted: true
            },
            {
                name: isLoggedIn ? t.label.logout : t.label.login,
                link: isLoggedIn ? 'logout' : 'login'
            }
        ];

        var nav = links.filter(l => {
            return !l.restricted || isLoggedIn;
        }).map((link, i) => {
            return <NavItemLink to={link.link}>{link.name}</NavItemLink>
        });

        return (
            <Nav navbar right>
                {nav}
            </Nav>
        );
    },
    createUser: function () {

        var monthly = this.state.monthly.user;
        var alltime = this.state.alltime.user;
        var level   = this.state.level;

        if (!this.state.user.isLoggedIn()) {
            return <span></span>;
        }

        return (
            <Nav navbar>
                <NavItemLink to='badges' active={false}>
                    <span>{this.state.user.username} - {alltime.points.all} {t.label.points}</span>
                    <span> - #{alltime.place} {t.label.place} - {level} {t.label.level}</span>
                </NavItemLink>
            </Nav>
        );
    },
    render: function () {

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
