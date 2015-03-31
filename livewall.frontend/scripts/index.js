import React from 'react';
var Router = require('react-router');
var { Route, RouteHandler, Link, DefaultRoute} = Router;

import {ReactAdmin, ReactApp} from './components/app.js';
import {ReactWall} from './components/wall.js';
import {ReactLogin, ReactLogout} from './components/auth.js';
import {ReactSettings} from './components/settings.js';

import '../styles/main.less';

// React dev tools
if (typeof window !== 'undefined') {
    window.react = React;
}

var routes = (
    <Route handler={ReactApp}>
        <Route name='login' handler={ReactLogin}/>
        <Route name='settings' handler={ReactSettings}/>
        <Route name='logout' handler={ReactLogout}/>
        <Route name='admin' path='/' handler={ReactAdmin}>
            <DefaultRoute name='wall' handler={ReactWall}/>
        </Route>
    </Route>
);

Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.getElementById('react'));
});

// React.render(<ReactApp/>, document.getElementById('react'));
