import moment                       from 'moment';
import $                            from 'jquery';
import SETTINGS                     from '../settings.js';

/**
 * Fetch the points for the last 30 days
 *
 * @returns {Promise} The request
 */
export var getMonthlyPoints = () => {
    return $.get(`${SETTINGS.SERVER_URL}/api/points`, {

        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        from: moment().subtract(30, 'days').format()
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
    });
};
