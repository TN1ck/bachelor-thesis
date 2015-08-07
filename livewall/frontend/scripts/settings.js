import _     from 'lodash';
import store from 'store';


var settings = {};

/**
 * Permantly save values.
 *
 * @param {string} id - The key of the attribute
 * @param {*} value -  The value of the attribute, must be JSON-serializable
 */
function save (id, value) {
    settings[id] = value;
    store.set(id, value);
}

settings.save = save;

// used for authentication
settings.LOGIN_URL   = 'http://pia-dev-intern.dai-labor.de/login/';

// the profile URLs, used for searches/favourites
settings.PROFILE_URL = 'http://pia-dev-intern.dai-labor.de/service';

// url to the http-endpoints, when developing it is http://localhost:4000
settings.SERVER_URL  = 'http://localhost:4000';

// owa settings
settings.OWA = {
    owa_baseUrl: 'http://ia.dailab.de/owa/',
    siteId: '87a70ce46ea04de7c28dd1e4da31904c',
    apiKey: '1cd6f4568986197d6a0c0c179930f382'
};

// when set, will hide the header, useful for public displays of the application
settings.HIDE_HEADER = false;

// the used broker in the application
settings.broker = [
    {
        url:          'http://pia-dev-intern.dai-labor.de/service',
        brokerName:   'PIA_Dev_intern_BrokerBean',
        action:       'ACTION_SOLR',
        restricted:   true,
        autocomplete: true
    },
    {
        url:          'http://pia-dev.dai-labor.de/service',
        brokerName:   'PIA_Dev_BrokerBean',
        action:       'ACTION_SOLR',
        filter:       'dai-labor',
        restricted:   false,
        autocomplete: true
    }
];

// default color scheme
settings.color_scheme = 'color_pastel';

// client-side filter of the search-results
settings.FILTER = {
    content: ['kiel'],
    title: ['no title']
};

/**
 * Loads settings from localstorage.
 *
 */
function setFromLocal () {
    _.each(settings, (v, k) => {
        var value = store.get(k);
        if (value) {
            settings[k] = value;
        }
    });
}

setFromLocal(settings);

export default settings;
