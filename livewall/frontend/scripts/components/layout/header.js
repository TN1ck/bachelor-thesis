import React     from 'react/addons';
import Reflux    from 'reflux';
import {Link}    from 'react-router';

import {user}    from '../../auth.js';
import gameStore from '../../stores/game.js';
import SETTINGS  from '../../settings.js';

import t from '../../../shared/translations/translation.js';

export default React.createClass({
    displayName: 'header',
    mixins: [
        Reflux.connect(gameStore)
    ],
    render: function () {

        var links = [
            {
                name: 'wall',
                link: 'wall'
            },
            {
                name: 'settings',
                link: 'settings'
            },
            {
                name: <i style={{'lineHeight': 0}} className='fa fa-trophy'></i>,
                link: 'badges'
            },
            {
                name: <i style={{'lineHeight': 0}} className='fa fa-dollar'></i>,
                link: 'booster'
            },
            {
                name: <i style={{lineHeight: 0}} className='fa fa-users'></i>,
                link: 'social'
            },
            {
                name: user.isLogedIn() ? 'logout' : 'login',
                link: user.isLogedIn() ? 'logout' : 'login'
            }
        ];

        var nav = links.map((link, i) => {
            var seperator = '|';
            if (i === links.length - 1) {
                seperator = '';
            }
            return <span> <Link to={link.link}>{link.name}</Link> {seperator}</span>;
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

        return (
            <div className='wall__header'>
                <div className='wall__header__topbar'>
                    {userComponent}
                    <div className='wall__header__settings'>
                        {nav}
                    </div>
                </div>
            </div>
        );
    }
});
