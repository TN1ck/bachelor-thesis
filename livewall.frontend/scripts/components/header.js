'use strict';

import React from 'react/addons';
import {Link} from 'react-router';

import {user} from '../auth.js';

export var ReactHeader = React.createClass({
    displayName: 'header',
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
                name: <i style={{'lineHeight': 0}}className='fa fa-trophy'></i>,
                link: 'trophies'
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

        return (
            <div className='wall__header'>
                <div className='wall__header__topbar'>
                    <div className='wall__header__info'>
                        Angemeldet als {user.username}
                    </div>
                    <div className='wall__header__settings'>
                        {nav}
                    </div>
                </div>
            </div>
        );
    }
});
