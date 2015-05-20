'use strict';

import _ from 'lodash';
import Reflux from 'reflux';
import Immutable from 'immutable';
import jquery from 'jquery';

import actions from '../actions.js';
import {user} from '../auth.js';
import {SETTINGS} from '../settings.js';

export var badges = [
    {
        id: 'login_1'
        name: 'ANMELDUNG',
        number: '1',
        type: 'none',
        fill: '#9c4274',
        image: '/assets/key.png',
    },
    {
        id: 'login_3'
        name: 'TAGE IN FOLGE',
        number: '3',
        type: 'none',
        fill: '#F5A623',
        image: '/assets/repeat.png',
    },
    {
        id: 'login_7',
        name: 'TAGE IN FOLGE',
        number: '7',
        type: 'king',
        fill: '#F5A623',
        image: '/assets/repeat.png',
    },
    {
        id: 'repeat_15',
        name: 'TAGE IN FOLGE',
        number: '15',
        type: 'emperor',
        fill: '#F5A623',
        image: '/assets/repeat.png',
    },
    {
        id: 'upvotes_10',
        name: 'UPVOTES',
        number: '10',
        type: 'none',
        fill: '#96bf48',
        image: '/assets/upvote.png',
    },
    {
        id: 'upvotes_100',
        name: 'UPVOTES',
        number: '100',
        type: 'king',
        fill: '#96bf48',
        image: '/assets/upvote.png',
    },
    {
        id: 'upvotes_1000',
        name: 'UPVOTES',
        number: '1000',
        type: 'emperor',
        fill: '#96bf48',
        image: '/assets/upvote.png',
    },
    {
        id: 'downvotes_10',
        name: 'DOWNVOTES',
        number: '10',
        type: 'none',
        fill: '#ec663c',
        image: '/assets/downvote.png',
    },
    {
        id: 'downvotes_100',
        name: 'DOWNVOTES',
        number: '100',
        type: 'king',
        fill: '#ec663c',
        image: '/assets/downvote.png',
    },
    {
        id: 'downvotes_1000',
        name: 'DOWNVOTES',
        number: '1000',
        type: 'emperor',
        fill: '#ec663c',
        image: '/assets/downvote.png',
    },
    {
        id: 'search_100',
        name: 'SUCHEN',
        number: '100',
        type: 'none',
        fill: '#47bbb3',
        image: '/assets/search.png',
    },
    {
        id: 'search_1000',
        name: 'SUCHEN',
        number: '1000',
        type: 'king',
        fill: '#47bbb3',
        image: '/assets/search.png',
    },
    {
        id: 'search_10000',
        name: 'SUCHEN',
        number: '10000',
        type: 'emperor',
        fill: '#47bbb3',
        image: '/assets/search.png',
    },
    {
        id: 'favourites_10',
        name: 'FAVORITEN',
        number: '10',
        type: 'none',
        fill: '#248EE6',
        image: '/assets/star.png',
    },
    {
        id: 'favourites_100',
        name: 'FAVORITEN',
        number: '100',
        type: 'king',
        fill: '#248EE6',
        image: '/assets/star.png',
    },
    {
        id: 'favourites_1000',
        name: 'FAVORITEN',
        number: '1000',
        type: 'emperor',
        fill: '#248EE6',
        image: '/assets/star.png',
    }
];

export var gameStore = Reflux.createStore({

    init: function () {

        this.items = Immutable.OrderedMap();

        this.listenTo(actions.upvoteItem, this.upvoteItem);
        this.listenTo(actions.downvoteItem, this.downvoteItem);
        this.listenTo(actions.favouriteItem, this.favouriteItem);

        this.state = {
            points: 500,
            badges: ['login_1', 'login_3', 'login_7', 'login_15', 'favourites_10'];
        };

        this.listenTo(actions.changedQueries);

    },

    addQuery: function (queryTerm) {

    },
    removeQuery: function (queryTerm) {

    },

    upvoteItem: function (uuid) {

    },

    downvoteItem: function (uuid) {

    },

    favouriteItem: function (uuid) {

    }

});
