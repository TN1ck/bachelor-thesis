'use strict';

import React from 'react/addons';
import Reflux from 'reflux';
import {RouteHandler} from 'react-router';

import actions from '../actions.js';
import {SETTINGS} from '../settings.js';
import {user, requireAuth} from '../auth.js';
import {gameStore} from '../stores/game.js';

import {ReactHeader} from './header.js';

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

export var ReactApp = React.createClass({
    displayName: 'app',
    mixins: [
        Reflux.listenTo(gameStore, 'onStoreChange')
    ],
    contextTypes: {
        router: React.PropTypes.func
    },
    onStoreChange: function () {

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
