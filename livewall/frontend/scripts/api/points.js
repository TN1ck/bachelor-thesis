import moment                       from 'moment';
import _                            from 'lodash';
import $                            from 'jquery';
import * as owa                     from '../owa.js';
import SETTINGS                     from '../settings.js'
import {user}                       from '../auth.js';

/**
 * Fetch the points for the last 30 days
 *
 * @returns {Promise} The request
 */
export var getMonthlyPoints = () => {
    return $.get(`${SETTINGS.SERVER_URL}/api/points`, {

        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        from: moment().subtract(30, 'days').toString(),
        to: moment().toString()
    }).then(result => {
        return _.extend(result, {
            user: _.find(result.users, {username: user.username})  || {
                booster: [],
                badges: [],
                actions: [],
                points: {
                    all: 0
                }
            }
        });
    });
};

/**
 * Fetch the points for the whole time
 *
 * @returns {Promise} The request
 */
export var getAllTimePoints = () => {
    return $.get(`${SETTINGS.SERVER_URL}/api/points`, {
        dataType: 'json',
        contentType: 'application/json; charset=utf-8'
    }).then(result => {
        return _.extend(result, {
            user: _.find(result.users, {username: user.username}) || {
                booster: [],
                badges: [],
                actions: [],
                points: {
                    all: 0
                }
            }
        });
    });
};
