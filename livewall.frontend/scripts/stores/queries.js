import _          from 'lodash';
import Reflux     from 'reflux';
import Immutable  from 'immutable';
import jquery     from 'jquery';
import moment     from 'moment';

import actions    from '../actions.js';
import {user}     from '../auth.js';
import {SETTINGS} from '../settings.js';
import agents     from '../agents/agents.js';

import Query      from '../models/Query.js';

//
// QUERY STORE
//

export default Reflux.createStore({

    init: function () {

        this.queries = {};

        this.listenTo(actions.addQuery,    this.addQuery);
        this.listenTo(actions.removeQuery, this.removeQuery);
        this.listenTo(actions.loadItems, this.loadItems);

        user.whenLogedIn(() => {
            SETTINGS.QUERIES
                .forEach(term => {
                    actions.addQuery(term);
                });
        });

    },

    addQuery: function (term) {

        if (this.queries[term]) {
            return;
        }

        var query = new Query(term, agents);

        query.loadData().forEach(promise => {
            promise.then(items => {

                var _items = items.map((d, i) => {
                    d.query = query;
                    var dIm = Immutable.Map(d);

                    return dIm;

                });

                actions.addItems(_items);

                return _items;

                this.trigger(this.queries);

            });

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
