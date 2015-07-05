import $ from 'jquery';
import SETTINGS from '../settings.js';
import {user}    from '../auth.js';

export var postAction = (data) => {
    return $.post(`${SETTINGS.SERVER_URL}/api/user/action`, _.extend({
        dataType: 'json',
        contentType: 'application/json; charset=utf-8'
    },  {
        username: user.username
    }, data));
};

export var getItems = (uuids) => {
    return $.get(`${SETTINGS.SERVER_URL}/api/items?items=${uuids}&username=${user.username}`);
};

export var postVote = (data) => {
    return $.post(`${SETTINGS.SERVER_URL}/api/user/vote`, _.extend({
        dataType: 'json',
        contentType: 'application/json; charset=utf-8'
    },  {
        username: user.username
    }, data));
};
