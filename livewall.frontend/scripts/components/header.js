'use strict';

import React from 'react/addons';
import {Link} from 'react-router';

import {user} from '../auth.js';

export var ReactHeader = React.createClass({
    displayName: 'header',
    render: function () {

        var links = [
            'wall',
            'settings',
            'logout'
        ];
        var nav = links.map((link, i) => {
            var seperator = '|';
            if (i === links.length - 1) {
                seperator = '';
            }
            return <span> <Link to={link}>{link}</Link> {seperator}</span>;
        });

        return (
            <div className='wall-header'>
                <div className='wall-header-topbar'>
                    <div className='wall-header-info'>
                        Angemeldet als {user.username}
                    </div>
                    <div className='wall-header-settings'>
                        {nav}
                    </div>
                </div>
            </div>
        );
    }
});
