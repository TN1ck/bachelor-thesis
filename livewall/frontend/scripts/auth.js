import User from './models/User.js';

export var user = new User();

export var requireAuth = {
    statics: {
        willTransitionTo: function (transition, params, query, callback) {
            user.isLogedIn((result) => {
                if (!result) {
                    transition.redirect('/login', {}, {'nextPath' : transition.path});
                }
                callback();
            });
        }
    }
};
