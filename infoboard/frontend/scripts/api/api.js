import $ from 'jquery';
import SETTINGS from '../settings.js';
import {user}    from '../auth.js';

/**
 * Post an action to the backend
 *
 * @param {Object} data The action to be send
 * @returns {Promise} The request
 */
export function postAction (data) {
    return $.post(`${SETTINGS.SERVER_URL}/api/user/action`, _.extend({
        dataType: 'json',
        contentType: 'application/json; charset=utf-8'
    },  {
        username: user.username
    }, data));
}

/**
 * Fetch all Items from the server with that match one of the provided uuids
 *
 * @param {String[]} uuids A list of the uuids of the items
 * @returns {Promise} The request
 */
export function getItems (uuids) {
    return $.post(`${SETTINGS.SERVER_URL}/api/items`, {
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        username: user.username,
        items: uuids
    });
}

/**
 * Fetch the last performed Actions
 *
 * @param {Number} limit Number of actions to fetch, default 50
 * @returns {Promise} The request
 */
export function getActions (limit = 50) {
    return $.get(`${SETTINGS.SERVER_URL}/api/actions?${limit}`);
}

/**
 * Post a vote to the backend
 *
 * @param {Object} data The vote to be posted
 * @returns {Promise} the request
 */
export function postVote (data) {
    return $.post(`${SETTINGS.SERVER_URL}/api/user/vote`, _.extend({
        dataType: 'json',
        contentType: 'application/json; charset=utf-8'
    },  {
        username: user.username
    }, data));
}

/**
 * Post a booster to the backend
 *
 * @param {Object} booster The Booster to be posted
 * @returns {Promise} The request
 */
export function postBooster (booster) {
    return $.post(`${SETTINGS.SERVER_URL}/api/user/booster`, {
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        username: user.username,
        booster: booster
    });
}
