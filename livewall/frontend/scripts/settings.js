import _     from 'lodash';
import store from 'store';

// DEFAULTS
var settings = {};

settings.save = (id, value) => {
    settings[id] = value;
    store.set(id, value);
};

settings.LOGIN_URL   = 'http://pia-dev-intern.dai-labor.de/login/';
settings.PROFILE_URL = 'http://pia-dev-intern.dai-labor.de/service';
settings.PIA_URL     = 'http://pia-dev-intern.dai-labor.de';

settings.SERVER_URL  = 'http://localhost:4000';
settings.SOCKET_URL  = 'http://localhost:4001';

settings.OWA = {
    owa_baseUrl: 'http://ia.dailab.de/owa/',
    // owa_baseUrl: 'http://localhost:4000/',
    siteId: '87a70ce46ea04de7c28dd1e4da31904c',
    apiKey: '1cd6f4568986197d6a0c0c179930f382'
};

settings.HIDE_HEADER = false;

settings.broker = [
    {
        url:          "http://pia-dev-intern.dai-labor.de/service",
        brokerName:   "PIA_Dev_intern_BrokerBean",
        action:       "ACTION_SOLR",
        restricted:   true,
        autocomplete: true
    },
    {
        url:          "http://pia-dev.dai-labor.de/service",
        brokerName:   "PIA_Dev_BrokerBean",
        action:       "ACTION_SOLR",
        filter:       "dai-labor",
        restricted:   false,
        autocomplete: true
    }
    // {
    //     url:          "http://localhost:8083/jiac/",
    //     action:       "ACTION_LOCAL_SEARCH",
    //     brokerName:   "LocalBroker",
    //     restricted:   false,
    //     autocomplete: false
    // }
];

settings.color_scheme = 'color_pastel';

settings.QUERIES = [
    // 'politics',
    // 'machine',
    // 'dai',
    // 'test',
    // 'wurst',
    // 'hamburg',
    // 'münchen',
    // 'berlin',
    // 'münster',
    // 'systeme',
    // 'tastatur',
    // 'apple',
    // 'gamification'
];

settings.FILTER = {
	'content': [
        // 'dai',
        'kiel'
    ],
	'title': ['no title']
};

// // check if there are import SETTINGS set
var setFromLocal = function () {
    _.each(settings, (v, k) => {
        var value = store.get(k);
        if (value) {
            settings[k] = value;
        }
    });
};

setFromLocal(settings);

export default settings;
