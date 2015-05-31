'use strict';

import _ from 'lodash';

// DEFAULTS
var defaults = {};

defaults.LOGIN_URL = 'http://pia-intern.dai-labor.de/login/';
defaults.PROFILE_URL = 'http://pia-intern.dai-labor.de/service';
defaults.PIA_URL   = 'http://pia-intern.dai-labor.de';

defaults.OWA = {
    owa_baseUrl: 'http://ia.dailab.de/owa/',
    // owa_baseUrl: 'http://localhost:4000/',
    siteId: '87a70ce46ea04de7c28dd1e4da31904c',
    apiKey: '1cd6f4568986197d6a0c0c179930f382'
};

defaults.QUERIES = [
    'politics',
    'machine',
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
	'content': ['dai', 'kiel'],
	'title': ['no title']
};



// // check if there are settings set
// var setFromLocal = function(settings) {
//     _.each(settings, (v, k) => {
//         var value = store.get(k);
//         if (value) {
//             defaults[k] = value;
//         }
//     });
// };
//
// setFromLocal(defaults);

export var SETTINGS = defaults;

export var save = function () {
    _.each(SETTINGS, (v, k) => {
        store.save(k, v);
    });
};
