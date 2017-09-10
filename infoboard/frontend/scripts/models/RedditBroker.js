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
        // Not implemented
        return;
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
        
        var endsWith = function(str, term)
        {
            var lastIndex = str.lastIndexOf(term);
            return (lastIndex !== -1) && (lastIndex + term.length === str.length);
        }

        let height;
        let width;

        var items = json.data.children.map((d, i) => {
            d = d.data;
            var type = 'link';

            if (d.domain.indexOf('imgur.com') > -1 && !(d.url.indexOf('/a/') > -1)
                && !endsWith(d.url, '.gifv') || endsWith(d.url, '.jpg')) {

                type = 'image';
                if (!(endsWith(d.url, '.jpg') || endsWith(d.url, '.png'))) {
                    d.url = 'http://firesize.com/x/500x500/g_none/' + d.url + '.jpg';
                }

                height = d.preview.images[0].source.height;
                width = d.preview.images[0].source.width;
            }

            return {
                query: this.query,
                uuid: d.permalink,
                author: d.author,
                created: d.created,
                title: d.title,
                url: d.url,
                imageHeight: height,
                imageWidth: width,
                score: Math.round(d.score / 100),
                domain: d.domain,
                type: type,
                // score: _.random(0, 10)
            };
        });
        return items;
    }

    getData () {

        var url = 'https://www.reddit.com';

        if (this.query) {
            url += '/r/' + this.query;
        }

        url += '/.json';

        this.promise = $.getJSON(url).promise().then(json => {
            return this.processJSON(json);
        }).fail(() => {
            return [];
        });

        return this.promise;
    }
}