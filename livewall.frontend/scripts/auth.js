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
            console.log(json);

            // extract searches and favorites
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

            // favorites are the first entry, searches the second
            this.profileRoots = {
                favorites: json[0],
                searches: json[1]
            };

            var searches = {};
            var favorites = {};

            extract(this.profileRoots.favorites, favorites);
            extract(this.profileRoots.searches, searches);

            this.searches = searches;
            this.favorites = favorites;

            return json;
        });

    }

    favorite (item) {

        if (!this.profileRoots.favorites) {
            console.error('No favorite root set.');
            return;
        }

        var params = {
            username: this.username,
            token: this.token,
            action: 'ACTION_MANAGE_ADD',
            parentId: this.profileRoots.favorites.id,
            item: JSON.stringify(item)
        };

        return $.ajax({
            type: 'GET',
            url: SETTINGS.PROFILE_URL,
            data: params,
            dataType: 'jsonp',
            jsonp: 'json.wrf',

        }).promise().then(json => {
            console.log(json);
            return json;
        }).fail().then(() => {
            console.error('error when trying to favorite item');
        });
    }

    unfavorite (item) {

        var _item  = this.favorites[item.uuid];

        if (_item) {
            console.error('Cannot unfavorite things that aren not favorited yet');
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

        }).promise().then(json => {
            console.log(json);
            return json;
        }).fail().then(() => {
            console.error('error when trying to unfavorite item');
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

        if (username && token) {
            // make pseudo request and check if it works
            this.token = token;
            this.username = username;
            return true;
        }

        return false;
    }

    isLogedIn () {
        return !!this.token;
    }
}

export var user = new User();

export var requireAuth = {
    statics: {
        willTransitionTo: function (transition) {
            console.log('check login..', user.isLogedIn());
            if (!user.isLogedIn()) {
                transition.redirect('/login', {}, {'nextPath' : transition.path});
            }
        }
    }
};
