import $ from 'jquery';

/* important settings for our owa instance */
var owa_baseUrl = 'http://ia.dailab.de/owa/';
var siteId = '87a70ce46ea04de7c28dd1e4da31904c';
var apiKey = '1cd6f4568986197d6a0c0c179930f382';

/* make owa visible */
var owa_cmds = window.owa_cmds || [];
window.owa_cmds    = owa_cmds;
window.owa_baseUrl = owa_baseUrl;

/**
 * initial events - siteID and which events we automatically we want to capture
 */
owa_cmds.push(['setSiteId', siteId]);
owa_cmds.push(['trackPageView']);
owa_cmds.push(['trackClicks']);
owa_cmds.push(['trackDomStream']);

/**
 * append the script tag to the dom, this will download and execute the owa-client-library
 */
var appendToDom = function () {
    var _owa = document.createElement('script');
    _owa.type = 'text/javascript';
    _owa.async = true;
    owa_baseUrl = ('https:' == document.location.protocol ? window.owa_baseSecUrl || owa_baseUrl.replace(/http:/, 'https:') : owa_baseUrl );
    _owa.src = owa_baseUrl + 'modules/base/js/owa.tracker-combined-min.js';
    var _owa_s = document.getElementsByTagName('script')[0];
    _owa_s.parentNode.insertBefore(_owa, _owa_s);
};

appendToDom();

//
// low level apis
//

/**
 * convience methods for tracking
 * @param {string} group The group the actions corresponds to
 * @param {string} action The specific action that will be tracked
 * @param {*} label data that will be send alongside this event
 * @param {number} rank The rank of the action (?)
 */
export var track = function (group, action, label = '', rank = 0) {
    window.owa_cmds.push(['trackAction', group, action, label, rank]);
};

/**
 * wrapper around the owa-web-api
 * @param {Object} constrains Constrains defined as key/value-pairs
 * @param {string[]} dimensions A list of all the dimensions
 * @returns {Promise} A promise that returns the result of the http-call if resolved
 */
export var api = function (constraints, dimensions) {
    return $.ajax({
        url: `${owa_baseUrl}api.php`,
        data: {
            owa_apiKey: apiKey,
            owa_constraints: constraints,
            owa_dimensions: dimensions,
            owa_do: 'getResultSet',
            owa_format: 'json',
            owa_metrics: 'actions',
            owa_siteId: siteId
        },
        type: 'GET'
    });
};
