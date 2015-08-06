import User from './models/User.js';

/** @global */
export var user = new User();

/** Mixin to require auth for certain aspects of the application.
 * The check is done asynchronesly, because we need to first check if
 * the provided token is still valid.
 * Will redirect to login when authentication fails.
 * @mixin
*/
export var requireAuth = {
    statics: {
        willTransitionTo: function (transition, params, query, callback) {
            user.isLoggedIn((result) => {
                if (!result) {
                    transition.redirect('/login', {}, {'nextPath' : transition.path});
                }
                callback();
            });
        }
    }
};
