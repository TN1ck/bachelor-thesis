import $          from 'jquery';
import _          from 'lodash';
import moment     from 'moment';

import SETTINGS   from './settings.js';
import {user}     from './auth.js';

/* important settings for our owa instance */
var owa_baseUrl = SETTINGS.OWA.owa_baseUrl;
var siteId = SETTINGS.OWA.siteId;
var apiKey = SETTINGS.OWA.apiKey;

/* make owa visible */
var owa_cmds = window.owa_cmds || [];
window.owa_cmds    = owa_cmds;
window.owa_baseUrl = owa_baseUrl;

/**
 * initial events - siteID and which events we automatically we want to capture
 */
owa_cmds.push(['setSiteId', siteId]);
// owa_cmds.push(['trackPageView']);
// owa_cmds.push(['trackClicks']);
// owa_cmds.push(['trackDomStream']);

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
//

var initUser = function(username) {
    console.log('setCustomVar2', username);
    window.owa_cmds.push(['setCustomVar', '2', 'username', username, 'session']);
    track('auth', username, 'login', 0);
};

user.whenLogedIn(initUser);

/**
 * convience methods for tracking
 * @param {string} group The group the actions corresponds to
 * @param {string} action The specific action that will be tracked
 * @param {*} label data that will be send alongside this event
 * @param {number} rank The rank of the action (?)
 */
export var track = function (group, action, label = '', rank = 0) {
    console.log('track', group, action, label, rank);
    window.owa_cmds.push(['trackAction', group, action, label, rank]);
};

/**
 * wrapper around the owa-web-api
 * @param {Object} constrains Constrains defined as key/value-pairs
 * @param {string[]} dimensions A list of all the dimensions
 * @returns {Promise} A promise that returns the result of the http-call if resolved
 */
export var api = function (
    _constraints,
    _dimensions,
    _startDate = moment().subtract(1, 'month'),
    _endDate = moment()) {


    var dimensions  = _dimensions.join(',');
    var constraints = _.pairs(_constraints).map(pair => {
        return pair.join('==');
    }).join(',');

    var format = 'YYYYMMDD';

    console.log(constraints, dimensions);

    var data = _.pairs({
        'owa_do':             'getResultSet',
        'owa_siteId':         siteId,
        'owa_apiKey':         apiKey,
        'owa_format':         'json',
        'owa_metrics':        'actions',
        'owa_endDate':        _endDate.format(format),
        'owa_startDate':      _startDate.format(format),
        'owa_dimensions':     dimensions,
        'owa_constraints':    constraints,
        'owa_resultsPerPage': Number.MAX_SAFE_INTEGER
    }).map(pair => pair.join('=')).join('&');

    return $.ajax({
        url: `${owa_baseUrl}api.php?${data}`,
        type: 'GET',
        dataType: 'json'
    });
};

//
// aggregation functions
//

var _aggregateUserData = function (data = []) {
    /* every row looks like this:

        date: "20150530",
        actionGroup: "search",
        actionName: "aussiehst",
        actionLabel: "add",
        customVarName2: "username",
        customVarValue2: "nick",
        actions: "1"

    */

    /* group by user/actionGroup/actionLabel, resulting data structure looks like this:
    {
        user1: {
            actionGroup1: {
                actionLabel1: {
                    count: ...,
                    uniqueCount: ...,
                    data: all the rows,
                    group: ...,
                    user: ...
                },
                ...
            },
            ...
        },
        user2: ...
    }

    */
    var groupedData = _.chain(data)
        .filter(x => x.customVarValue2 !== '(not set)')
        .groupBy(x => x.customVarValue2)
        .mapValues(
            byUser => {
                return _.chain(byUser)
                    .groupBy(x => x.actionGroup)
                    .mapValues(byGroup => {
                        return _.chain(byGroup)
                            .groupBy(x => x.actionLabel)
                            .mapValues(byLabel => {
                                var first = _.first(byLabel);
                                return {
                                    count:       _.sum(byLabel, x => _.parseInt(x.actions)),
                                    uniqueCount: byLabel.length,
                                    rows:        _.sortBy(byLabel, 'date'),
                                    label:       first.actionLabel,
                                    group:       first.actionGroup,
                                    user:        first.customVarValue2
                                };
                            })
                            .value()
                    })
                    .value();
            }
        )
        .value();

    return groupedData;

};

//
// high level aggregation
//

// userdata

export var getAllTimeUserData = function () {
    var startDate = moment().subtract(10, 'years');
    var endDate   = moment();
    return getUserDataForTimeRange(startDate, endDate);
};

export var getMonthlyUserData = function () {
    var startDate = moment().subtract(1, 'month');
    var endDate   = moment();
    return getUserDataForTimeRange(startDate, endDate);
};

export var getUserDataForTimeRange = function (startDate, endDate) {
    var constraints = {
    };
    var dimensions = [
        'date',
        'actionGroup',
        'actionName',
        'actionLabel',
        'customVarName2',
        'customVarValue2'
    ];
    return api(constraints, dimensions, startDate, endDate).then((result) => _aggregateUserData(result.rows));
};

export var processTileData = function () {

};
