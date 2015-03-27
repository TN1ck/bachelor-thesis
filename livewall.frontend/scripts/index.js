import React from 'react';
import {ReactApp, ReactLogin, ReactAdmin, ReactWall} from './main.js';
var Router = require('react-router');
var { Route, RouteHandler, Link, DefaultRoute} = Router;

// React dev tools
if (typeof window !== 'undefined') {
    window.react = React;
}

var routes = (
    <Route handler={ReactApp}>
        <Route name='login' handler={ReactLogin}/>
        <Route name='admin' path='/' handler={ReactAdmin}>
            <DefaultRoute name='wall' handler={ReactWall}/>
        </Route>
    </Route>
);

Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.getElementById('react'));
});

// React.render(<ReactApp/>, document.getElementById('react'));
