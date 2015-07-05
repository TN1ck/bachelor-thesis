import _ from 'lodash';

// DEFAULTS
var defaults = {};

defaults.LOGIN_URL   = 'http://pia-intern.dai-labor.de/login/';
defaults.PROFILE_URL = 'http://pia-intern.dai-labor.de/service';
defaults.PIA_URL     = 'http://pia-intern.dai-labor.de';

defaults.SERVER_URL  = 'http://localhost:4000';

defaults.OWA = {
    owa_baseUrl: 'http://ia.dailab.de/owa/',
    // owa_baseUrl: 'http://localhost:4000/',
    siteId: '87a70ce46ea04de7c28dd1e4da31904c',
    apiKey: '1cd6f4568986197d6a0c0c179930f382'
};

defaults.HIDE_HEADER = false;

defaults.broker = [
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

defaults.QUERIES = [
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

defaults.FILTER = {
	'content': [
        // 'dai',
        'kiel'
    ],
	'title': ['no title']
};



// // check if there are import SETTINGS set
// var setFromLocal = function(import SETTINGS) {
//     _.each(import SETTINGS, (v, k) => {
//         var value = store.get(k);
//         if (value) {
//             defaults[k] = value;
//         }
//     });
// };
//
// setFromLocal(defaults);

export default defaults;
//
// export var save = function () {
//     _.each(import SETTINGS, (v, k) => {
//         store.save(k, v);
//     });
// };