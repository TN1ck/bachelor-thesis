import $ from 'jquery';

import {getDomain} from '../../shared/util/utils.js';

/**
 * Creates a new Broker. The Broker is used to fetch query-results.
 *
 * @class
 */
export default class Broker {

    /**
     * Initialize the Broker
     * @param {{url: String, name: String, restricted: Boolean, action: String, autocomplete: Boolean}}
     * @returns {Broker} `this`
     */
    constructor(broker = {
            url:          '',
            name:         '',
            restricted:   false,
            action:       'ACTION_SOLR',
            autocomplete: false,
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

        if (json.status && json.status.code !== 200) {
            console.error('Authentication failed');
            return [];
        }

        var docs = [];

        var types = {
            Leibniz: 'pia-pdf',
            Kontakte: 'pia-contact',
            Web: 'pia-web'
        };

        json.results.forEach((results) => {
            var type = types[results.type] || 'pia-pdf';
            docs = docs.concat(results.solr.response.docs.map(item => {
                item.type = type;
                return item;
            }));
        });

        var items = [];

        docs.forEach((d) => {

            var item = {
                query:   this.query,
                uuid:    d.file_URI || d.source || d.file_content || d.xmp_title,
                author:  d.result_type,
                created: d.file_lastModification,
                title:   d.xmp_title,
                content: d.file_content,
                url:     d.file_URI,
                domain:  d.host || getDomain(d.file_URI),
                type:    d.type,
                score:   d.normalized_score,
                raw:     d
            };
            items.push(item);
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

        if (this.broker.name === '') {
            console.error('PIA SOURCE HAS NO BROKER SET, ABORT REQUEST');
            return;
        }

        var url = this.broker.url;

        var params = {
            query:        this.query,
            start:        0,
            num:          10,
            autocomplete: this.broker.autocomplete,
            username:     user.username,
            action:       this.broker.action,
            sort:         'xmp_date desc'
        };

        if (this.filter) {
            params.filter = this.filter;
        }

        if (this.broker.restricted) {
            params.token = user.token;
        }

        var request = $.ajax({
            type:     'GET',
            url:      url,  // Send the login info to this page
            data:     params,
            dataType: 'jsonp',
            jsonp:    'json.wrf',

        })

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
