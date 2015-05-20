'use strict';

import _ from 'lodash';

// DEFAULTS
var defaults = {};

defaults.LOGIN_URL = 'http://pia-intern.dai-labor.de/login/';
defaults.PROFILE_URL = 'http://pia-intern.dai-labor.de/service';
defaults.PIA_URL   = 'http://pia-intern.dai-labor.de';

defaults.QUERIES = [
    'politics',
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
