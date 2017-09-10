import _     from 'lodash';


var settings = {};

/**
 * Permantly save values.
 *
 * @param {string} id - The key of the attribute
 * @param {*} value -  The value of the attribute, must be JSON-serializable
 */
function save (id, value) {
    settings[id] = value;
    localStorage.setItem(id, JSON.stringify(value));
}

settings.save = save;

// used for authentication
settings.LOGIN_URL   = '';

// the profile URLs, used for searches/favourites
settings.PROFILE_URL = '';

// url to the http-endpoints, when developing it is http://localhost:4000
settings.SERVER_URL  = 'http://localhost:4000';

// owa settings
settings.OWA = {
    owa_baseUrl: '',
    siteId: '',
    apiKey: ''
};

// when set, will hide the header, useful for public displays of the application
settings.HIDE_HEADER = false;

// which language should be used, there is none set in default
settings.LANGUAGE = '';

// language that should be used as default
settings.DEFAULT_LANGUAGE = 'de';

// the used broker in the application
settings.broker = [
    {
        url: 'http://www.reddit.com/search.json',
        brokerName: 'Reddit',
    }
];

// default color scheme
settings.color_scheme = 'color_pastel';

// client-side filter of the search-results
settings.FILTER = {
    content: ['kiel'],
    title: ['no title']
};

// defines the polling-rate in seconds
settings.POLLING_RATE = false;

/**
 * Loads settings from localstorage.
 *
 */
function setFromLocal () {
    _.each(settings, (v, k) => {
        var value = localStorage.getItem(k);
        if (value) {
            settings[k] = JSON.parse(value);
        }
    });
}

setFromLocal(settings);

export default settings;
