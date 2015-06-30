import React           from 'react';
import Router          from 'react-router';

import {ReactApp}      from './components/app.js';
import {ReactAdmin}    from './components/admin.js';
import {ReactWall}     from './components/wall/wall.js';
import {ReactLogin}    from './components/auth/login.js';
import {ReactLogout}   from './components/auth/logout.js';
import {ReactSettings} from './components/settings.js';
import ReactRewards    from './components/rewards.js';
import {ReactTrophies} from './components/trophies/trophies.js';
import ReactSocial     from './components/social/social.js';

import '../styles/main.less';

var { Route, RouteHandler, Link, DefaultRoute } = Router;

// React dev tools
if (typeof window !== 'undefined') {
    window.react = React;
}

var routes = (
    <Route handler={ReactApp}>
        <Route name='login'          handler={ReactLogin}/>
        <Route name='admin' path='/' handler={ReactAdmin}>
            <Route        name='logout'   handler={ReactLogout}/>
            <Route        name='settings' handler={ReactSettings}/>
            <Route        name='rewards'  handler={ReactRewards}/>
            <Route        name='trophies' handler={ReactTrophies}/>
            <Route        name='social'   handler={ReactSocial}/>
            <DefaultRoute name='wall'     handler={ReactWall}/>
        </Route>
    </Route>
);

Router.run(routes, function (Handler) {
    React.render(<Handler/>, document.getElementById('react'));
});
