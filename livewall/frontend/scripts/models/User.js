import $          from 'jquery';
import cookies    from 'cookies-js';
import SETTINGS   from '../settings.js';


/**
 * Creates a new User. Proides functions to authenticate the user, as well as
 * favourite items and load his profile.
 *
 * @class
 */
export default class User {

    /**
     * Initalises the User as `Gast`
     */
    constructor () {
        this.username = 'Gast';
        this.password = '';
        this.token = '';
        this.loginViaCookie();
        this.whenLogedInPromise = $.Deferred();
        this.whenProfileIsLoadedPromise = $.Deferred();
    }

    /**
     * Will initialize the user with the given username and token. Will resolve
     * the `whenLogedInPromise`.
     *
     * @param {{username: String, token: String}} The username and the token
     */
    initUser ({username, token}) {
        this.username = username;
        this.token    = token;
        this.setCookie();
        this.whenLogedInPromise.resolve(this.username);
        this.profile().then(result => {
            this.whenProfileIsLoadedPromise.resolve(result);
            return result;
        });
    }

    //
    // PROFILE HANDLING
    //

    /**
     * Fetch the profile of the user
     *
     * @returns {Promise} The promise of the request
     */
    profile () {

        var params = {
            username: this.username,
            token: this.token,
            action: 'ACTION_MANAGE_LOAD_PROFILE'
        };

        return $.ajax({
            type: 'GET',
            url: SETTINGS.PROFILE_URL,
            data: params,
            dataType: 'jsonp',
            jsonp: 'json.wrf'

        }).promise().then(json => {
            return this.processProfile(json);
        });

    }

    /**
     * Returns `whenProfileIsLoadedPromise`
     * @returns {Promise}
     */
    whenProfileIsLoaded (cb) {
        return this.whenProfileIsLoadedPromise.then(cb);
    }

    /**
     * Will process the profile and recursivly find all saved queries and
     * favourited items
     * @returns {{queries: Object[], favourites: Object[]}} The queries and favourites
     */
    processProfile (json) {

        // extract queries and favourites
        var extract = function (node, results) {
            // is it a leave?
            var isLeave = !node.itemgroup;
            // if leave, end recursion
            if (isLeave) {
                results[node.source] = node;
            // recursion
            } else {
                node.itemgroup.forEach((n) => extract(n, results));
            }
            return;
        };

        // favourites are the first entry, queries second
        this.profileRoots = {
            favourites: json[0],
            queries: json[1]
        };

        var queries = {};
        var favourites = {};

        extract(this.profileRoots.favourites, favourites);
        extract(this.profileRoots.queries, queries);

        this.queries = queries;
        this.favourites = favourites;

        return {
            queries: queries,
            favourites: favourites
        };
    }

    /**
     * Favourite the given item in the profile of the user
     *
     * @param {Object} item The item to be favourite
     * @returns {Promise} The Promise of the request
     */
    favourite (item) {

        // Only happens when the profile was not correctly loaded
        /*eslint-disable */
        if (!this.profileRoots.favourites) {
            console.error('No favourite root set.');
            return;
        }

        var rawItem = item.get('raw');

        if (!rawItem) {
            console.error('Only Elements that are conform to the DAI-Apis can be favourited.');
            return;
        }
        /*eslint-enable */

        var escapedRawItem = escape(JSON.stringify(rawItem));

        // all the parameters needed to favourite the item
        var params = {
            username: this.username,
            token: this.token,
            action: 'ACTION_MANAGE_ADD',
            parentId: this.profileRoots.favourites.id,
            item: JSON.stringify({
                name: item.get('title'),
                source: item.get('uuid'),
                document: escapedRawItem
            })
        };

        // favourite the item
        /*eslint-disable */
        return $.ajax({
            type: 'GET',
            url: SETTINGS.PROFILE_URL,
            data: params,
            dataType: 'jsonp',
            jsonp: 'json.wrf'

        }).then(json => {
            return json;
        });
        /*eslint-enable */
    }

    /**
     * Unfavourite the given item in the profile of the user
     *
     * @param {Object} item The item to be unfavourited
     */
    unfavourite (item) {

        var _item  = this.favourites[item.get('uuid')];

        if (!_item) {
            /*eslint-disable */
            console.error('Cannot unfavourite things that aren not favorited yet');
            /*eslint-enable */
            return;
        }

        var params = {
            username: this.username,
            token: this.token,
            action: 'ACTION_MANAGE_REMOVE',
            itemId: _item.id
        };

        /*eslint-disable */
        return $.ajax({
            type: 'GET',
            url: SETTINGS.PROFILE_URL,
            data: params,
            dataType: 'jsonp',
            jsonp: 'json.wrf'

        }).then(json => {
            return json;
        });
        /*eslint-enable */
    }

    //
    // LOGIN/LOGOUT HANDLING
    //

    /**
     * Perform the login-request, if its sucessfull, initialize the user.
     *
     * @param {String} username The username of the user
     * @param {String} password The password of the user
     * @param {Boolean} remember Remember the user
     * @returns {Promise} The Promise of the request
     */
    login (username, password, remember) {

        this.username = username;
        this.password = password;
        this.remember = remember;

        return $.ajax({
            url: SETTINGS.LOGIN_URL,
            data: {
                username: this.username,
                password: this.password
            },
            type: 'POST'
        }).then(data => {
            this.initUser(data);
        });

    }

    /**
     * Returns `whenLogedInPromise`
     * @returns {Promise}
     */
    whenLogedIn (cb) {
        return this.whenLogedInPromise.then(cb);
    }

    /**
     * Will check if the provided token is still valid, if it is, initialize the user
     *
     * @param {String} token The token that will be checked
     * @param {String} username The username for the given token
     * @returns {Promise}
     */
    checkLogin (token, username) {
        return $.ajax({
            url: SETTINGS.PROFILE_URL,
            data: {
                username: username,
                token: token,
                action: 'ACTION_CHECK_LOGIN'
            },
            dataType: 'jsonp',
            jsonp: 'json.wrf',
            type: 'GET'
        }).then( response => {
            // token is valid, auth sucessfull
            if (response &&
                response.status &&
                response.status.code === 200) {
                this.initUser({
                    username: username,
                    token: token
                });
                return true;
            // token is not valid, auth failed
            }
            return false;
        });
    }

    /**
     * Tries to authenticate the user with the saved cookie
     */
    loginViaCookie () {

        var username = cookies.get('username');
        var token = cookies.get('token');

        if (token) {
            this.loginPromise = this.checkLogin(token, username).then(() => {
                this.loginPromise = false;
            }).fail(() => {
                this.loginPromise = false;
            });
        }

    }

    /**
     * Check if the user is authenticated
     *
     * @param {Function} cb A Callback that will be called with the result of the authentication
     * @returns {Promies|Boolean} If the authentication is still running, a Promise is returned,
     * else the status of the authentication as Boolean
     */
    isLoggedIn (cb) {

        // check if a login-request is running and call the callback with the result
        if (this.loginPromise && cb) {
            this.loginPromise.then((result) => {
                cb(result);
            }).fail(() => {
                cb(false);
            });
            return false;
        }

        if (cb) {
            cb(!!this.token);
        }

        return !!this.token;
    }

    /**
     * Log out the user
     *
     * @param {Function} cb Function to be called after sucessfull log out
     */
    logout (cb) {
        this.username = 'Gast';
        this.password = '';
        this.token = '';
        this.deleteCookie();
        cb();
    }

    //
    // COOKIE HANDLING
    //
    //

    /**
     * Set a cookie to remember the user, will be used to authenticate with token
     */
    setCookie () {
        if (this.token && this.remember) {
            cookies.set('username', this.username);
            cookies.set('token', this.token);
        }
    }

    /**
     * Delete the cookie
     */
    deleteCookie () {
        cookies.expire('username');
        cookies.expire('token');
    }
}
