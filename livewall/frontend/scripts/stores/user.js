import _          from 'lodash';
import Reflux     from 'reflux';
import moment     from 'moment';

import actions    from '../actions/actions.js';
import {user}     from '../auth.js';
import SETTINGS   from '../settings.js';

//
// USER STORE
//

export default Reflux.createStore({

    init: function () {
        this.state = {
            user: user
        };

        this.listenTo(actions.login,  this.login);
        this.listenTo(actions.logout, this.logout);

    },

    getInitialState: function () {
        return this.state;
    },

    login: function(username, password, remember, cb, errCb) {
        return user.login(username, password, remember)
            .then(cb    || () => {})
            .then(() => {
                this.trigger(this.state);
            })
            .fail(errCb || () => {});
    },

    logout: function () {
        return user.logout(() => {
            this.trigger(this.state);
        });
    }

});
