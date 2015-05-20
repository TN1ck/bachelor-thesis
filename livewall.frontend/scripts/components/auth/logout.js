'use strict';

import React from 'react/addons';
import {Link} from 'react-router';

import {dataStore} from '../../stores/data.js';
import {user} from '../../auth.js';

export var ReactLogout = React.createClass({
    componentDidMount: function () {
        user.logout();
        dataStore.reset();
    },
    render: function () {
        return (
            <div className='wall__login'>
                <div className="wall__login__header">
                    Sie haben sich erfolgreich ausgeloggt.
                </div>
                <div className="wall__login__content">
                    <div className='center'>
                        <i className="fa fa-5x fa-check olive"></i>
                    </div>
                    <div className='center'>
                        <Link to="login">
                            <button>Anmelden</button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
});
