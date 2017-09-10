import $ from 'jquery';
import _ from 'lodash';

import {getDomain} from '../../shared/util/utils.js';

/**
 * Creates a new Broker. The Broker is used to fetch query-results.
 *
 * @class
 */
export default class Broker {

    /**
     * Initialize the Broker
     * @param {{url: String, name: String}}
     * @returns {Broker} `this`
     */
    constructor(broker = {
        url:          '',
        name:         '',
    }, query, filter) {
        this.broker = broker;
        this.query = query;
        this.filter = filter;
        return this;
    }

    /**
     * Get the key of the broker
     * @returns {String}
     */
    get key () {
        return `${this.name} - ${this.broker.name} - ${this.query}`;
    }

    /**
     * Get the name of the broker
     * @returns {String}
     */
    get name () {
        return `${this.name}|${this.broker.name}`;
    }

    /**
     * Abort all running requests
     */
    abort () {
        this.request.abort();
    }

    /**
     * Get status of request
     */
    get status () {
        return this.promise ? this.promise.state() : 'pending';
    }

    /**
     * Process the request-result
     *
     * @param {Object} The result of the request
     * @returns {Objects[]} The processed items
     */
    processJSON (json) {

        var items = [];

        var types = {
            Leibniz: 'pia-pdf',
            Kontakte: 'pia-contact',
            Web: 'pia-web'
        };

        json.data.children.forEach((child) => {
            items.push({
                query: this.query,
                uuid: child.data.id,
                author: child.data.author,
                created: child.data.created,
                title: child.data.title,
                content: child.data.url,
                domain: child.data.domain,
                type: types.Leibniz,
                score: child.data.score,
                raw: child,
            });
        });

        return items;

    }

    /**
     * Start the request for the saved query
     *
     * @param {{username: String, token: String}} The user, needed for restricted sources
     * @returns {Promise} The promise of the request
     */
    getData (user) {

        var url = `${this.broker.url}?q=${this.query}`;

        var request = $.ajax({
            type:     'GET',
            url:      url,  // Send the login info to this page
            dataType: 'json',
        });

        var promise = request.then(json => {
            return this.processJSON(json);
        }).fail(() => {
            return [];
        });

        this.promise = promise;

        this.request = request;

        return promise;
    }
}
