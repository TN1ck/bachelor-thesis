import React               from 'react/addons';
import {RouteHandler}      from 'react-router';

import Header              from './layout/header.js';
import Messages            from './messages/messages.js';

// Header and Messages are used through the whole app
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
