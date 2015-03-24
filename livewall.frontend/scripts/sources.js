import $ from 'jquery';
import SETTINGS from './settings.js';

// The options you can give a source should not change their returned json, i.e. this is how we seperate them
// Due to this, we have a PiaSource for every broker it can can use


export class Reddit {

    constructor (search) {
        this.search = search;
    }

    get key () {
        return `${this.name} - ${this.search || 'frontpage'}`;
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

        var items = json.data.children.map((d, i) => {
            d = d.data;
            var type = 'link';

            if (d.domain.indexOf('imgur.com') > -1 && !(d.url.indexOf('/a/') > -1)
                && !endsWith(d.url, '.gifv') || endsWith(d.url, '.jpg')) {

                type = 'image';
                if (!(endsWith(d.url, '.jpg') || endsWith(d.url, '.png'))) {
                    d.url = 'http://firesize.com/x/500x300/g_none/' + d.url + '.jpg';
                }
            }

            return {
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

        if (this.search) {
            url += '/r/' + this.search;
        }

        url += '/.json';

        return $.getJSON(url).promise().then(json => {
            return this.processJSON(json);
        });
    }
}

class Pia {

    constructor(search, filter) {
        this.sourceName = 'pia';
        this.broker = {
            name: '',
            public: true
        };
        this.search = search;
        this.filter = filter;
    }

    get key () {
        return `${this.sourceName} - ${this.broker.name} - ${this.search}`;
    }

    get name () {
        return `${this.sourceName}|${this.broker.name}`;
    }

    processJSON (json) {

        var items = [];
        var docs = [].concat.apply([], json.results.map((d) => { return d.solr.response.docs; }));
        docs.forEach(function(d, i) {
            var content = d.file_content;
            var lines = content.split('...');
            lines = lines.filter(d => {
                return d.length > 2;
            }).map(d => {
                return d + '...';
            });
            var item = {
                author: d.result_type,
                created: d.file_lastModification,
                title: d.xmp_title,
                content: lines,
                url: d.file_URI,
                // score: d.score,
                domain: d.host,
                type: 'pia',
                score: Math.round(d.normalized_score)
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
            query: this.search,
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

        // http://pia-gesis.dai-labor.de/zentral?username=gesis3&query=pia%20enterprise&action=ACTION_SOLR&filter=dai-labor&start=0&num=10&dojo.preventCache=1426084708658&json.wrf=dojo.io.script.jsonp_dojoIoScript4._jsonpCallback

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
    constructor (search, filter) {
        super(search, filter);
        this.broker = {
            name: 'zentral',
            public: true
        };
    }
}

export class PiaHaus extends Pia {
    constructor (search, filter) {
        super(search, filter);
        this.broker = {
            name: 'haus',
            public: false
        };
    }
}
