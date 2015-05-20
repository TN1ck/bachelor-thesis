import $ from 'jquery';
import {SETTINGS} from './settings.js';
import cookies from 'cookies-js';

class User {

    constructor () {
        this.username = 'Gast';
        this.password = '';
        this.token = '';
        this.loginViaCookie();
    }

    loginRequest () {
        return $.ajax({
            url: SETTINGS.LOGIN_URL,
            data: {
                username: this.username,
                password: this.password
            },
            type: 'POST'
        });
    }

    checkLogin (token, username) {
        return $.ajax({
            url: SETTINGS.PROFILE_URL,
            data: {
                username: username,
                token: token,
                action: 'ACTION_CHECK_LOGIN',
            },
            dataType: 'jsonp',
            jsonp: 'json.wrf',
            type: 'GET'
        }).then( response => {
            if (response &&
                response.status &&
                response.status.code === 200) {
                    return true;
            } else {
                return false;
            }
        });
    }

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
            jsonp: 'json.wrf',

        }).promise().then(json => {
            return this.processProfile(json);
        });

    }

    processProfile (json) {

        // extract queries and favourites
        var extract = function (node, results) {
            // is it a leave?
            var isLeave = !node.itemgroup;
            // recursion end
            if (isLeave) {
                results[node.source] = node;
            } else {
                node.itemgroup.forEach((n) => extract(n, results));
            }
            return;
        };

        // favourites are the first entry, queries the second
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

    favourite (item) {

        if (!this.profileRoots.favourites) {
            console.error('No favourite root set.');
            return;
        }

        var rawItem = item.get('raw');

        if (!rawItem) {
            console.error('Only Elements that are conform to the DAI-Apis can be favourited.');
            return;
        }

        var escapedRawItem = escape(JSON.stringify(rawItem));

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

        return $.ajax({
            type: 'GET',
            url: SETTINGS.PROFILE_URL,
            data: params,
            dataType: 'jsonp',
            jsonp: 'json.wrf',

        }).then(json => {
            return json;
        });
    }

    unfavourite (item) {

        var _item  = this.favourites[item.get('uuid')];

        if (!_item) {
            console.error('Cannot unfavourite things that aren not favorited yet');
            return;
        }

        var params = {
            username: this.username,
            token: this.token,
            action: 'ACTION_MANAGE_REMOVE',
            itemId: _item.id,
        };

        return $.ajax({
            type: 'GET',
            url: SETTINGS.PROFILE_URL,
            data: params,
            dataType: 'jsonp',
            jsonp: 'json.wrf',

        }).then(json => {
            return json;
        });
    }

    upvote (item, factor) {

    }

    downvote (item) {

    }

    login (username, password, keep) {

        this.username = username;
        this.password = password;

        return this.loginRequest().then(data => {
            this.token = data.token;
            if (keep) {
                this.setCookie();
            }
        });

    }

    logout () {
        this.username = 'Gast';
        this.password = '';
        this.token = '';
        this.deleteCookie();
    }

    setCookie () {
        if (this.token) {
            cookies.set('username', this.username);
            cookies.set('token', this.token);
        }
    }

    deleteCookie () {
        cookies.expire('username');
        cookies.expire('token');
    }

    loginViaCookie () {

        var username = cookies.get('username');
        var token = cookies.get('token');

        if (token) {
            this.loginPromise = this.checkLogin(token, username).then((result) => {
                if (result) {
                    this.token = token;
                    this.username = username;
                }
                this.loginPromise = false;
                return result;
            }).fail(() => {
                this.loginPromise = false;
                return result;
            });
        }

        return false;
    }

    isLogedIn (cb) {

        // check if a login-request is running and call the callback with the result
        if (this.loginPromise && cb) {
            this.loginPromise.then((result) => {
                cb(result);
            }).fail(() => {
                cb(false);
            });
            return;
        }

        if (cb) {
            cb(!!this.token);
        }

        return !!this.token;
    }
}

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
