import moment             from 'moment';
import store              from 'store';
import _                  from 'lodash';
import $                  from 'jquery';

import {getColorByString} from '../../shared/util/colors.js';
import {user}             from '../auth.js';
import SETTINGS           from '../settings.js';
import Broker             from './Broker.js';

/**
 * Creates a new Query. Queries are an abstraction on top of the Broker.
 * For one queryterm, it will fetch and combine the results of multiple Brokers.
 *
 * @class
 */
export default class Query {

    /**
     * Initialize the Query with a term and a list of Brokers
     *
     * @param {String} term The term used for querying
     * @param {Broker[]} List of Brokers that will be used to fetch the results
     * @returns {Broker} `this`
     */
    constructor (term, brokers) {
        this.term = term;
        this.date = moment();
        this.color = getColorByString(term, SETTINGS.color_scheme);
        this.brokerSettings = brokers;

        this.initBroker();

        return this;
    }

    /**
     * Initalize the Brokers
     *
     * @param {Broker[]}
     * @returns {Query} `this`
     */
    initBroker () {
        this.brokers = this.brokerSettings.map(b => {
            return new Broker(b, this.term);
        });

        return this;
    }

    /**
     * Abert the request
     *
     * @returns {Query} `this`
     */
    abort () {
        this.brokers.forEach(b => {
            b.abort();
        });
        return this;
    }

    /**
     * Returns locally saved items
     *
     * @returns {Object[]} List of items
     */
    readData () {
        return store.get(`query-${this.term}`) || [];
    }

    /**
     * Start the querying and save the results when finshied
     *
     * @param
     * @returns {Promises[]} List of all the requests of the Broker
     */
    loadData () {

        var promises = this.brokers.map(b => {
            return b.getData(user);
        });

        $.when(...promises).then((...results) => {
            this.saveData(_.flatten(results));
        });

        return promises;

    }

    /**
     * Locally save the items
     *
     * @param items
     * @returns {Broker} `this`
     */
    saveData (items) {
        try {
            store.set(`query-${this.term}`, items);
        } catch (e) {
            console.error(e);
        }
        return this;
    }

    /**
     * Override `valueOf`
     *
     * @returns {String} String representation of the Query
     */
    valueOf () {
        return this.term;
    }

}
