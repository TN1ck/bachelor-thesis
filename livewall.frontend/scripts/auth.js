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
        }).promise();
    }

    checkLogin (token) {
        return $.ajax({
            url: SETTINGS.PROFILE_URL,
            data: {
                token: token,
                action: 'ACTION_CHECK_LOGIN',
            },
            dataType: 'jsonp',
            jsonp: 'json.wrf',
            type: 'GET'
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

        // extract searches and favourites
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

        // favourites are the first entry, searches the second
        this.profileRoots = {
            favourites: json[0],
            searches: json[1]
        };

        var searches = {};
        var favourites = {};

        extract(this.profileRoots.favourites, favourites);
        extract(this.profileRoots.searches, searches);

        this.searches = searches;
        this.favourites = favourites;

        return {
            searches: searches,
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
            this.loginPromise = this.checkLogin(token).then(() => {
                this.token = token;
                this.username = username;
                this.loginPromise = false;
                return true;
            }).fail(() => {
                this.loginPromise = false;
                return false;
            });
        }

        return false;
    }

    isLogedIn (cb) {

        // check if a login-request is running and call the callback with the result
        if (this.loginPromise && cb) {
            this.loginPromise.then(() => {
                cb(true);
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
