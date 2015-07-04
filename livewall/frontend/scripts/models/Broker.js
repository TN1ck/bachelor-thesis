import $ from 'jquery';

import {getDomain} from '../../shared/util/utils.js';

// The options you can give a source should not change their returned json, i.e. this is how we seperate them
// Due to this, we have a PiaSource for every broker it can can use

export default class Pia {

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
    }

    get key () {
        return `${this.name} - ${this.broker.name} - ${this.query}`;
    }

    get name () {
        return `${this.name}|${this.broker.name}`;
    }

    abort () {
        this.request.abort();
    }

    get status () {
        return this.promise ? this.promise.state() : 'pending';
    }

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
                uuid:    d.file_URI || d.source,
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
