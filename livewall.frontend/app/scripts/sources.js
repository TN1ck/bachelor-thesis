import $ from 'jquery';
import SETTINGS from './settings.js';

export class RedditSource {

    constructor (search) {
        this.search = search;
    }

    getData () {
        
        var url = 'https://www.reddit.com';

        if (this.search) {
            url += '/r/' + this.search;
        }

        url += '/.json'

        return $.getJSON(url).promise().then(json => {

            var endsWith = function(str, term)
            {
                var lastIndex = str.lastIndexOf(term);
                return (lastIndex !== -1) && (lastIndex + term.length === str.length);
            }

            var tiles = json.data.children.map((d, i) => {
                d = d.data;
                var type = 'link';

                if (d.domain.indexOf('imgur.com') > -1 && !(d.url.indexOf('/a/') > -1)
                    && !endsWith(d.url, '.gifv') || endsWith(d.url, '.jpg')) {
                    
                    type = 'image';
                    if (!(d.url.endsWith('.jpg') || d.url.endsWith('.png'))) {
                        d.url += '.jpg';
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
                data: tiles
            }
        });
    }
};

export class PiaSource {
    constructor(user, broker, search, filter) {
        this.user = user;
        this.search = search;
        this.brokers = {
            zentral: {
                name: 'zentral',
                public: true
            },
            haus: {
                name: 'haus',
                public: false
            }
        };
        this.broker = this.brokers[broker];
    }

    getData () {
        var url = SETTINGS.PIA_URL + '/' + this.broker.name;
        
        var params = {
            query: this.search,
            start: 0,
            num: 10,
            username: this.user.username,
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

        }).promise().then(function (data) {
            console.log('pia', data);
            var items = [];
            var docs = [].concat.apply([], data.results.map((d) => { return d.solr.response.docs; }));
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
        });  
    }
};