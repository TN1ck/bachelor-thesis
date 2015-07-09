import _          from 'lodash';
import Reflux     from 'reflux';
import Immutable  from 'immutable';
import moment     from 'moment';

import actions    from '../actions/actions.js';
import {user}     from '../auth.js';
import SETTINGS   from '../settings.js';

import Query      from '../models/Query.js';

//
// QUERY STORE
//

export default Reflux.createStore({

    init: function () {

        this.queries = {};

        this.listenTo(actions.addQuery,    this.addQuery);
        this.listenTo(actions.removeQuery, this.removeQuery);

        user.whenProfileIsLoaded((profile) => {
            _.each(profile.queries, query => {
                actions.addQuery(query.name, false);
            });
        });

    },

    addQuery: function (term) {

        if (this.queries[term]) {
            return;
        }

        var query = new Query(term, SETTINGS.broker);

        var processItems = items => {

            var _items = items.map((d, i) => {
                d.query = query;
                var dIm = Immutable.Map(d);

                return dIm;

            });

            actions.addItems(_items);

            return _items;

            this.trigger(this.queries);

        };

        // first get the items from localstorage
        var savedItems = query.readData();
        processItems(savedItems);

        // make the real request
        query.loadData().forEach(promise => {
            promise.then(processItems);
        });

        this.queries[term] = query;

        this.trigger(this.queries);
    },

    removeQuery: function (term) {

        var query = this.queries[term];
        query.abort();
        delete this.queries[term];

        this.trigger(this.queries);

    },


});
