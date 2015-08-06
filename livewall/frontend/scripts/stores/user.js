import Reflux     from 'reflux';

import actions    from '../actions/actions.js';
import {user}     from '../auth.js';


/**
 * The userstore will provide the state of the user,
 * mostly used for the header-component
 */
export default Reflux.createStore({

    /**
     * Initialize the Userstore
     */
    init: function () {
        this.state = {
            user: user
        };

        this.listenTo(actions.login,  this.login);
        this.listenTo(actions.logout, this.logout);

    },

    /**
     * Returns the initial state
     * @returns {Object} The initial state
     */
    getInitialState: function () {
        return this.state;
    },

    /**
     * Log in the user with the provided credentials
     *
     * @param {String} username The username of the user
     * @param {String} password The password of the user
     * @param {Boolean} remember Set a cookie to remember the user
     * @param {Function} cb Callback that will be called when the user sucessfully logins
     * @param {Function} errCb Callback that will be called when the login fails
     * @returns {Promise} Promise that will be resolved when the user sucessfully logins
     */
    login: function(username, password, remember, cb = () => {}, errCb = () => {}) {
        return user.login(username, password, remember)
            .then(cb)
            .then(() => {
                this.trigger(this.state);
            })
            .fail(errCb);
    },

    logout: function () {
        return user.logout(() => {
            this.trigger(this.state);
        });
    }

});
