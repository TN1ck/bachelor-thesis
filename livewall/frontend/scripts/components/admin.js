import React               from 'react/addons';
import {RouteHandler}      from 'react-router';

import SETTINGS            from '../settings.js';
import {user, requireAuth} from '../auth.js';

export default React.createClass({
    mixins: [requireAuth],
    render: function () {
        return (
            <div className='wall'>
                <RouteHandler />
            </div>
        );
    }
});
