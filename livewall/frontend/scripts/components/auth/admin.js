import React               from 'react/addons';
import {RouteHandler}      from 'react-router';

import {requireAuth}       from '../../auth.js';

/**
 * Provides an easy way to require authentication for Components
 */
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
