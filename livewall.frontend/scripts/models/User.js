import $          from 'jquery';
import {SETTINGS} from '../settings.js';
import cookies    from 'cookies-js';

export default class User {

    constructor () {
        this.username = 'Gast';
        this.password = '';
        this.token = '';
        this.loginViaCookie();
        this.whenLogedInPromise = $.Deferred();
    }

    initUser (data) {
        this.token    = data.token;
        this.username = data.username;
        this.setCookie();
        this.whenLogedInPromise.resolve(this.username);
    }

    //
    // PROFILE HANDLING
    //

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

    //
    // LOGIN/LOGOUT HANDLING
    //

    login (username, password, keep) {

        this.username = username;
        this.password = password;

        return this.loginRequest().then(data => {
            this.initUser(data);
        });

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

    whenLogedIn (cb) {
        return this.whenLogedInPromise.then(cb);
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
                    this.initUser({
                        username: username,
                        token: token
                    });
                    return true;
            } else {
                return false;
            }
        });
    }


    loginViaCookie () {

        var username = cookies.get('username');
        var token = cookies.get('token');

        if (token) {
            this.loginPromise = this.checkLogin(token, username).then((data) => {
                this.loginPromise = false;
                return data;
            }).fail((result) => {
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

    logout () {
        this.username = 'Gast';
        this.password = '';
        this.token = '';
        this.deleteCookie();
    }

    //
    // COOKIE HANDLING
    //
    //

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
}
