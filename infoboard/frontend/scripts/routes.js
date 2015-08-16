import React           from 'react';
import Router          from 'react-router';

import App       from './components/app.js';
import Admin     from './components/auth/admin.js';
import Wall      from './components/wall/wall.js';
import Login     from './components/auth/login.js';
import Logout    from './components/auth/logout.js';
import Settings  from './components/settings/settings.js';
import Booster   from './components/booster/booster.js';
import UserStats from './components/userstats/userstats.js';
import Stats     from './components/stats/stats.js';

/* here we load the styles via webpack, this will enable us to load hotloading
   for styles as well
*/
import '../styles/main.less';

var { Route, DefaultRoute } = Router;

// needed for React dev tools
if (typeof window !== 'undefined') {
    window.react = React;
}

// configuration of the used routes in the application
var routes = (
    <Route handler={App}>
        <Route name='login'               handler={Login}/>
        <Route name='admin' path='/'      handler={Admin}>
            <Route        name='logout'   handler={Logout}/>
            <Route        name='settings' handler={Settings}/>
            <Route        name='booster'  handler={Booster}/>
            <Route        name='badges'   handler={UserStats}/>
            <Route        name='stats'    handler={Stats}/>
            <DefaultRoute name='wall'     handler={Wall}/>
        </Route>
    </Route>
);

// initiate the root-component and mount it onto the DOM-node
Router.run(routes, function (Handler) {
    React.render(<Handler/>, document.getElementById('react'));
});
