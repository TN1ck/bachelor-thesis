import $ from 'jquery';

import {getDomain} from './utils.js';
import {SETTINGS} from './settings.js';
import {hashCode, colors} from './utils.js';

// The options you can give a source should not change their returned json, i.e. this is how we seperate them
// Due to this, we have a PiaSource for every broker it can can use


export class Reddit {

    constructor (query) {
        this.query = query;
    }

    get key () {
        return `${this.name} - ${this.query || 'frontpage'}`;
    }

    get name () {
        return 'reddit';
    }

    processJSON (json) {

        var endsWith = function(str, term)
        {
            var lastIndex = str.lastIndexOf(term);
            return (lastIndex !== -1) && (lastIndex + term.length === str.length);
        }

        var color = colors[hashCode(this.query) % colors.length];

        var items = json.data.children.map((d, i) => {
            d = d.data;
            var type = 'link';

            if (d.domain.indexOf('imgur.com') > -1 && !(d.url.indexOf('/a/') > -1)
                && !endsWith(d.url, '.gifv') || endsWith(d.url, '.jpg')) {

                type = 'image';
                if (!(endsWith(d.url, '.jpg') || endsWith(d.url, '.png'))) {
                    d.url = 'http://firesize.com/x/500x500/g_none/' + d.url + '.jpg';
                }
            }

            return {
                color: color,
                query: this.query,
                uuid: d.permalink,
                author: d.author,
                created: d.created,
                title: d.title,
                url: d.url,
                score: Math.round(d.score / 100),
                domain: d.domain,
                type: type,
                // score: _.random(0, 10)
            };
        });
        return {
            data: items
        };
    }

    getData () {

        var url = 'https://www.reddit.com';

        if (this.query) {
            url += '/r/' + this.query;
        }

        url += '/.json';

        return $.getJSON(url).promise().then(json => {
            return this.processJSON(json);
        });
    }
}

class Pia {

    constructor(query, filter) {
        this.sourceName = 'pia';
        this.broker = {
            name: '',
            public: true
        };
        this.query = query;
        this.filter = filter;
    }

    get key () {
        return `${this.sourceName} - ${this.broker.name} - ${this.query}`;
    }

    get name () {
        return `${this.sourceName}|${this.broker.name}`;
    }

    processJSON (json) {

        if (json.status && json.status.code !== 200) {
            console.error('Authentication failed');
            return {data: []};
        }

        var docs = [];

        var types = {
            Leibniz: 'pia-pdf',
            Kontakte: 'pia-contact',
            Web: 'pia-web'
        };

        json.results.forEach((results) => {
            var type = types[results.type] || results.type;
            docs = docs.concat(results.solr.response.docs.map(item => {
                item.type = type;
                return item;
            }));
        });

        var items = [];

        var color = colors[hashCode(this.query) % colors.length];

        docs.forEach((d) => {

            var content = d.file_content;
            var lines = content;

            if (typeof content === 'string') {
                lines = content.split('...');
                lines = lines.filter(d => {
                    return d.length > 2;
                }).map(d => {
                    return d + '...';
                });
            }

            var item = {
                color: color,
                query: this.query,
                uuid: d.file_URI || d.source,
                author: d.result_type,
                created: d.file_lastModification,
                title: d.xmp_title,
                content: lines,
                url: d.file_URI,
                domain: d.host || getDomain(d.file_URI),
                type: d.type,
                score: Math.round(d.normalized_score),
                raw: d
            };
            items.push(item);
        });

        return {data: items};

    }

    getData (user) {

        if (this.broker.name === '') {
            console.error('PIA SOURCE HAS NO BROKER SET, ABORT REQUEST');
            return;
        }

        var url = SETTINGS.PIA_URL + '/' + this.broker.name;

        var params = {
            query: this.query,
            start: 0,
            num: 10,
            username: user.username,
            action: 'ACTION_SOLR'
        };

        if (this.filter) {
            params.filter = this.filter;
        }

        if (!this.broker.public) {
            params.token = user.token;
        }

        return $.ajax({
            type: 'GET',
            url: url,  // Send the login info to this page
            data: params,
            dataType: 'jsonp',
            jsonp: 'json.wrf',

        }).promise().then(json => {
            return this.processJSON(json);
        });
    }
}

export class PiaZentral extends Pia {
    constructor (query, filter) {
        super(query, filter);
        this.broker = {
            name: 'zentral',
            public: true
        };
    }
}

export class PiaHaus extends Pia {
    constructor (query, filter) {
        super(query, filter);
        this.broker = {
            name: 'haus',
            public: false
        };
    }
}
