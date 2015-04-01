'use strict';

import _ from 'lodash';

// DEFAULTS
var defaults = {};

defaults.LOGIN_URL = 'http://pia-gesis.dai-labor.de/login/';
defaults.PROFILE_URL = 'http://pia-gesis.dai-labor.de/haus';
defaults.PIA_URL   = 'http://pia-gesis.dai-labor.de';

defaults.SEARCHES = ['politics', 'machine', 'dai', 'test', 'wurst', 'whatever'];



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
