import React               from 'react/addons';
import Reflux              from 'reflux';
import {RouteHandler}      from 'react-router';

import SETTINGS            from '../settings.js';
import {user, requireAuth} from '../auth.js';
import gameStore           from '../stores/game.js';

import Header              from './layout/header.js';
import Messages            from './messages/messages.js';

export default React.createClass({
    displayName: 'app',
    render: function () {
        return (
            <div>
                <Header/>
                <Messages />
                <RouteHandler />
            </div>
        );
    }
});
