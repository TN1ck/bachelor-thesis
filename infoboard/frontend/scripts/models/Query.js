import moment             from 'moment';
// import _                  from 'lodash';
// import $                  from 'jquery';

import {getColorByString} from '../../shared/util/colors.js';
import {user}             from '../auth.js';
import SETTINGS           from '../settings.js';
import Broker             from './RedditBroker.js';

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
        this.setColor(SETTINGS.color_scheme);
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

        // disabled, quota was reached too often

        // var items = localStorage.getItem(`query-${this.term}`);
        // return items ? JSON.parse(items) : [];

        return [];
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

        // disabled, the quoto was reached too often

        // $.when(...promises).then((...results) => {
        //     this.saveData(_.flatten(results));
        // });

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
            localStorage.setItem(`query-${this.term}`, JSON.stringify(items));
        } catch (e) {
            console.error(e);
        }
        return this;
    }

    /**
     * Change the color of the query via a new color-scheme
     * @param {String} scheme The new color-scheme
     */
    setColor (scheme) {
        this.color = getColorByString(this.term, scheme);
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
