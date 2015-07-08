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
    NavItem
} from 'react-bootstrap';

import t from '../../../shared/translations/translation.js';

export default React.createClass({
    displayName: 'header',
    mixins: [
        Reflux.connect(gameStore)
    ],
    render: function () {

        var links = [
            {
                name: 'DAIWALL',
                link: ''
            },
            {
                name: 'Einstellungen',
                link: 'settings'
            },
            {
                name: <span>
                    <i style={{'lineHeight': 0}} className='fa fa-trophy'></i> Abzeichen
                </span>,
                link: 'badges'
            },
            {
                name: <span>
                    <i style={{'lineHeight': 0}} className='fa fa-dollar'></i> Punkte einlösen
                </span>,
                link: 'booster'
            },
            {
                name: <span>
                    <i style={{lineHeight: 0}} className='fa fa-users'></i> Statistik
                </span>,
                link: 'social'
            },
            {
                name: user.isLogedIn() ? 'logout' : 'login',
                link: user.isLogedIn() ? 'logout' : 'login'
            }
        ];

        var nav = links.map((link, i) => {
            return <NavItem eventKey={{i}} href={`#/${link.link}`}>{link.name}</NavItem>
        });

        var monthly = this.state.monthly.user;
        var alltime = this.state.alltime.user;

        var userComponent;

        if (!SETTINGS.HIDE_HEADER) {
            userComponent = <div className='wall__header__info'>
                <span>{t.header.label.loginAs} {user.username} </span>
                <a href="#/badges">
                    {alltime.points.all} {t.header.label.points}
                </a>
                <span> </span>
                <a href="#/badges">
                    #{monthly.place} {t.header.label.alltime} - #{alltime.place} {t.header.label.month}
                </a>
            </div>;
        }

        var brand = <a href='#/'>DAIWALL</a>

        return (
            <Navbar inverse brand={brand} toggleNavKey={0}>
                <Nav right eventKey={0}>
                    {nav}
                </Nav>
            </Navbar>
        );
    }
});
