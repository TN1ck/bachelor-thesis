import store from 'store';
import _ from 'lodash';

var SETTINGS = {};

// DEFAULT SETTINGS
SETTINGS.LOGIN_URL = 'http://pia-gesis.dai-labor.de/login/';
SETTINGS.PIA_URL   = 'http://pia-gesis.dai-labor.de';

// check if there are settings set

var getLocalSettings = function(settings) {
    var result = _.extend({}, settings);
    _.each(settings, (v, k) => {
        var value = store.get(k);
        if (value) {
            result[key] = value;
        }
    });
    return result;
};

getLocalSettings(SETTINGS);

export default SETTINGS;