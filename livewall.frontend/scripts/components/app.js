'use strict';

import React from 'react/addons';
import {RouteHandler} from 'react-router';

import actions from '../actions.js';
import {SETTINGS} from '../settings.js';
import {user, requireAuth} from '../auth.js';

import {ReactHeader} from './header.js';

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

export var ReactAdmin = React.createClass({
    mixins: [requireAuth],
    render: function () {
        return (
            <div className='wall'>
                <RouteHandler />
            </div>
        );
    }
})

export var ReactApp = React.createClass({
    displayName: 'app',
    contextTypes: {
        router: React.PropTypes.func
    },
    render: function () {
        var router = this.context.router;
        return (
            <div>
                <ReactHeader/>
                <ReactCSSTransitionGroup transitionName="from-above" transitionAppear={true}>
                    <RouteHandler key={router.getCurrentPath()} />
                </ReactCSSTransitionGroup>
            </div>
        );
    }
});
