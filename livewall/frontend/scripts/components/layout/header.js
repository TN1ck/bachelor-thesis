import React     from 'react/addons';
import Reflux    from 'reflux';
import {Link}    from 'react-router';

import {user}    from '../../auth.js';
import gameStore from '../../stores/game.js';
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
        Reflux.connect(gameStore)
    ],
    render: function () {

        var style = {lineHeight: 0};

        var links = [
            {
                name: 'DAIWALL',
                link: 'wall'
            },
            {
                name: <span>
                    <i style={style} className='fa fa-gears'></i> Einstellungen
                    </span>,
                link: 'settings'
            },
            {
                name: <span>
                    <i style={style} className='fa fa-trophy'></i> Abzeichen
                </span>,
                link: 'badges'
            },
            {
                name: <span>
                    <i style={style} className='fa fa-dollar'></i> Booster
                </span>,
                link: 'booster'
            },
            {
                name: <span>
                    <i style={style} className='fa fa-bar-chart'></i> Statistik
                </span>,
                link: 'social'
            },
            {
                name: user.isLogedIn() ? 'logout' : 'login',
                link: user.isLogedIn() ? 'logout' : 'login'
            }
        ];

        var nav = links.map((link, i) => {
            return <NavItemLink to={link.link}>{link.name}</NavItemLink>
        });

        var monthly = this.state.monthly.user;
        var alltime = this.state.alltime.user;
        var level   = this.state.level;

        var userComponent;

        if (SETTINGS.HIDE_HEADER) {
            return <span></span>;
        }

        var brand = <a href='#/'>DAIWALL</a>

        return (
            <Navbar fluid inverse toggleNavKey={0}>
                <CollapsibleNav eventKey={0}>
                    <Nav navbar>
                        <NavItemLink to='badges' active={false}>
                            <span>{user.username} - {alltime.points.all} {t.header.label.points}</span>
                            <span> - #{alltime.place} Platz - {level} Level</span>
                        </NavItemLink>
                    </Nav>
                    <Nav navbar right>
                        {nav}
                    </Nav>
                </CollapsibleNav>
            </Navbar>
        );
    }
});
