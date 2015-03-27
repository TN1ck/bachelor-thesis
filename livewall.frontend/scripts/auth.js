import $ from 'jquery';
import SETTINGS from './settings.js';
import cookies from 'cookies-js';

class User {

    constructor () {
        this.username = 'Gast';
        this.password = '';
        this.token = '';
        this.loginViaCookie();
    }

    request () {

        return $.ajax({
            url: SETTINGS.LOGIN_URL,
            data: 'username=' + this.username + '&' + 'password=' + this.password,
            processData: false,
            type: 'POST'
        }).promise();
    }

    login (username, password, keep) {

        this.username = username;
        this.password = password;

        return this.request().then(data => {
            this.token = data.token;
            if (keep) {
                this.setCookie()
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
