import React               from 'react/addons';
import Reflux              from 'reflux';
import {RouteHandler}      from 'react-router';

import SETTINGS            from '../settings.js';
import {user, requireAuth} from '../auth.js';
import gameStore           from '../stores/game.js';

import Header              from './header.js';

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

export default React.createClass({
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
                <Header/>
                <RouteHandler key={router.getCurrentPath()} />
            </div>
        );
    }
});
