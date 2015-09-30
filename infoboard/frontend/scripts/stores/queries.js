import _          from 'lodash';
import Reflux     from 'reflux';
import Immutable  from 'immutable';

import actions    from '../actions/actions.js';
import {user}     from '../auth.js';
import SETTINGS   from '../settings.js';

import Query      from '../models/Query.js';

/**
 * The Querystore handles the querying of Brokers
 */
export default Reflux.createStore({

    /**
     * Initialization of the Querystore, will set the inital state, create
     * listeners and load all queries that are saved by the user when he
     * sucessfully authenticates
     */
    init: function () {

        this.queries = {};

        this.listenTo(actions.addQuery,    this.addQuery);
        this.listenTo(actions.removeQuery, this.removeQuery);
        this.listenTo(actions.changeColorScheme, this.changeColorScheme);
        this.listenTo(actions.reloadQueries, this.reloadQueries);

        // load all saved queries when the user authenticates
        user.whenProfileIsLoaded((profile) => {
            _.each(profile.queries, query => {

                // we do not want to track the queries, that's why false
                actions.addQuery(query.name, false);
            });
        });

    },

    /**
     * Returns the initial state
     * @returns {Object} The initial state
     */
    getInitialState: function () {
        return this.queries;
    },

    /**
     * Change the color of the queries via a new color-scheme
     * @param {String} scheme The new color-scheme
     */
    changeColorScheme: function (scheme) {
        _.each(this.queries, q => {
            q.setColor(scheme);
        });
        this.trigger(this.queries);
    },

    /**
     * Load the items from the given query
     *
     * @param {Query} query Load the items from the query and process its items
     */
    loadQuery: function (query) {

        var processItems = (items) => {
            var _items = items.map((d) => {
                d.query = query;
                var dIm = Immutable.Map(d);

                return dIm;

            });

            actions.addItems(_items);
            this.trigger(this.queries);

            return _items;
        };

        query.loadData().forEach(promise => {
            promise.then(processItems);
        });
    },

    /**
     * QUery all brokers for the given term, will send the action `addItems`
     * when the qUerying is finished
     *
     * @param {String} term The term that will be queried
     */
    addQuery: function (term) {

        if (this.queries[term]) {
            return;
        }

        var query = new Query(term, SETTINGS.broker);

        // make the real request
        this.loadQuery(query);

        this.queries[term] = query;

        this.trigger(this.queries);
    },

    /**
     * Requery all Queries
     */
    reloadQueries: function () {

        _.each(this.queries, q => {
            this.loadQuery(q);
        });

        this.trigger(this.queries);
    },

    /**
     * Remove a query
     *
     * @param {String} The query that will be removed
     */
    removeQuery: function (term) {

        var query = this.queries[term];
        query.abort();
        delete this.queries[term];

        this.trigger(this.queries);

    }

});
