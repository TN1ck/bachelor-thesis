import { trophieFunctions, badges } from '../../shared/gamification/badges.js';
import {pointsForActions}           from '../../shared/gamification/points.js';
import moment                       from 'moment';
import _                            from 'lodash';
import $                            from 'jquery';
import * as owa                     from '../owa.js';
import SETTINGS                     from '../settings.js'
import {user}                       from '../auth.js';

export var getMonthlyPoints = () => {
    return $.get(`${SETTINGS.SERVER_URL}/api/points`, {

        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        from: moment().subtract(1, 'month').toString(),
        to: moment().toString()
    }).then(result => {
        return _.extend(result, {
            user: _.find(result.users, {username: user.username})  || result.users[0]
        });
    });
};

export var getAllTimePoints = () => {
    return $.get(`${SETTINGS.SERVER_URL}/api/points`, {
        dataType: 'json',
        contentType: 'application/json; charset=utf-8'
    }).then(result => {
        return _.extend(result, {
            user: _.find(result.users, {username: user.username}) || result.users[0]
        });
    });
};
