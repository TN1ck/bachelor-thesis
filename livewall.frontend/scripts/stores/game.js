'use strict';

import _ from 'lodash';
import Reflux from 'reflux';
import Immutable from 'immutable';
import jquery from 'jquery';

import actions from '../actions.js';
import {user} from '../auth.js';
import {SETTINGS} from '../settings.js';

export var gameStore = Reflux.createStore({

    init: function () {

        this.items = Immutable.OrderedMap();

        this.listenTo(actions.upvoteItem, this.upvoteItem);
        this.listenTo(actions.downvoteItem, this.downvoteItem);
        this.listenTo(actions.favouriteItem, this.favouriteItem);

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
