import React  from 'react/addons';
import Reflux from 'reflux';
import {Link} from 'react-router';

import {user} from '../auth.js';
import gameStore from '../stores/game.js';

export var ReactHeader = React.createClass({
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
                link: 'trophies'
            },
            {
                name: <i style={{'lineHeight': 0}} className='fa fa-dollar'></i>,
                link: 'rewards'
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

        return (
            <div className='wall__header'>
                <div className='wall__header__topbar'>
                    <div className='wall__header__info'>
                        <span>Angemeldet als {user.username} </span>
                        <a href="#/trophies">
                            {alltime.trophies.points} Punkte
                        </a>
                        <span> </span>
                        <a href="#/trophies">
                            #{monthly.place} diesen Monat - #{alltime.place} Gesamt
                        </a>
                    </div>
                    <div className='wall__header__settings'>
                        {nav}
                    </div>
                </div>
            </div>
        );
    }
});
