import _ from 'lodash';
import React from 'react';
import $ from 'jquery';
import cookies from 'cookies';
import store from 'store';
import Reflux from 'reflux';
import Immutable from 'immutable';

import {RedditSource, PiaSource} from './sources.js';
import SETTINGS from './settings.js';
import actions from './actions.js';

export class User {

    constructor () {
        this.username = '';
        this.password = '';
        this.token = '';
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
            console.log(data);
            this.token = data.token; 
            if (keep) {
                this.setCookie()
            }
        });

    }

    logout () {
        this.username = '';
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

export var userStore = Reflux.createStore({
    
    init: function () {
        
        this.user = new User();
        this.error = false;

        this.user.loginViaCookie();
        this.listenTo(actions.login, this.login);
        this.listenTo(actions.logout, this.logout);

    },

    getInitialState: function () {
        return this.triggerState.bind(this)();
    },

    login: function (user) {
        var that = this;
        this.user.login(user.username, user.password, user.keep).then(() => {
            this.triggerState.bind(that)();
        });
    },

    logout: function () {
        this.user.logout();
        this.triggerState.bind(this)();
    },

    getState: function () {
        return {
            username: this.user.username,
            password: this.user.password,
            token: this.user.token,
            error: this.error
        };
    },

    triggerState: function () {
        var state = this.getState();
        this.trigger(state);
    }


});


export var dataStore = Reflux.createStore({

    init: function () {

        this.items = Immutable.List();
        
        this.cache = {};
        this.itemCounter = 0;
        this.user = userStore.getState();
        this.sources =  [];
        this.sources.push({
            source: new PiaSource(this.user, 'zentral', 'dai labor'),
            polling: false
        });
        this.sources.push({
            source: new RedditSource('politics'),
            polling: 30
        });
        // this.sources.push({
        //     source: new RedditSource('earthporn'),
        //     polling: 30
        // });

        // listen for changes of user
        this.listenTo(userStore, this.changeUser);

        this.listenTo(actions.addItem, this.addItem);
        this.listenTo(actions.upvoteItem, this.upvoteItem);
        this.listenTo(actions.loadItems, this.loadItems);
    },

    changeUser: function(user) {
        if (user.token) {
            this.user = user;
            this.reset();
            this.loadItems();
        }
    },

    loadSource: function (source) {
        source.getData().then(data => {

            data.data.forEach((d, i) => {
                // append tile when image finishes loading
                if (d.type === 'image') {
                    var img = new Image;
                    img.src = d.url;
                    img.onload = () => {
                        var dIm = Immutable.Map(d);
                        this.addItem(dIm);
                    };    
                } else {
                    setTimeout(() => {
                        var dIm = Immutable.Map(d);
                        this.addItem(dIm);
                    }, _.random(200 * i));
                }
                
            });

        });
    },

    loadItems: function () {
        this.sources.forEach(s => {
           this.loadSource(s.source);
        });

        // polling
        this.sources.forEach(s => {
            if (s.polling) {
                var callback = () => {
                    console.log('polling...');
                    this.loadSource(s.source);
                    setTimeout(function() {
                        callback();
                    }, s.polling * 1000);
                };

                setTimeout(function() {
                    callback();
                }, s.polling * 1000);

            }
        })
    },

    reset: function (item) {
        this.items = Immutable.List();
        this.cache = {};
    },

    addItem: function (item) {
        
        var uuid = item.get('title') + item.get('content');
        item = item.set('uuid', uuid);
        
        if (this.cache[uuid]) {
            var item_cached = this.cache[uuid];
            var index = item_cached.get('i');
            item = item.set('i', index);
            this.items = this.items.set(index, item);
        } else {
            item = item.set('i', this.items.count());
            this.items = this.items.push(item);
        }

        this.cache[uuid] = item;

        this.triggerState.bind(this)();

        this.itemCounter++;
    },

    removeItem: function (item) {
        var index = item.get('i');
        this.items = this.items.splice(index, 1);
        delete this.cache[item.get('uuid')];
    },

    triggerState: function () {
        this.trigger(this.items);
    },

    upvoteItem: function (item) {
        item = item.update('score', x => { return x + 1 });
        this.items = this.items.set(item.get('i'), item);
        this.triggerState.bind(this)(this.items);
    }

});