import React           from 'react';
import Router          from 'react-router';

import App      from './components/app.js';
import Admin    from './components/admin.js';
import Wall     from './components/wall/wall.js';
import Login    from './components/auth/login.js';
import Logout   from './components/auth/logout.js';
import Settings from './components/settings.js';
import Booster  from './components/booster.js';
import Trophies from './components/trophies/trophies.js';
import Social   from './components/social/social.js';

import '../styles/main.less';

var { Route, RouteHandler, Link, DefaultRoute } = Router;

// React dev tools
if (typeof window !== 'undefined') {
    window.react = React;
}

var routes = (
    <Route handler={App}>
        <Route name='login'               handler={Login}/>
        <Route name='admin' path='/'      handler={Admin}>
            <Route        name='logout'   handler={Logout}/>
            <Route        name='settings' handler={Settings}/>
            <Route        name='booster'  handler={Booster}/>
            <Route        name='trophies' handler={Trophies}/>
            <Route        name='social'   handler={Social}/>
            <DefaultRoute name='wall'     handler={Wall}/>
        </Route>
    </Route>
);

Router.run(routes, function (Handler) {
    React.render(<Handler/>, document.getElementById('react'));
});
