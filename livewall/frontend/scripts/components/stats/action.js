import React       from 'react';
import moment      from 'moment';
import _           from 'lodash';

import t           from '../../../shared/translations/translation.js';
import {colors}    from '../../../shared/util/colors.js';

import IconCard    from '../utility/iconcard.js';
import Icon        from '../utility/icon.js';

var actions = {
    auth: {
        login: {
            text: t.stats.actions.auth.login,
            icon: 'key',
            fill: colors.vinrouge
        }
    },
    query: {
        add: {
            text: t.stats.actions.query.add,
            icon: 'query',
            fill: colors.buttercup
        },
        remove: {
            text: t.stats.actions.query.remove,
            icon: 'query',
            fill: colors.buttercup
        },
    },
    favourite: {
        toggle: {
            text: t.stats.actions.query.favourite,
            icon: 'star',
            fill: colors.curious_blue
        }
    },
    vote: {
        up: {
            text: t.stats.actions.vote.up,
            icon: 'upvote',
            fill: colors.sushi
        },
        down: {
            text: t.stats.actions.vote.down,
            icon: 'downvote',
            fill: colors.burnt_sienna
        }
    }
};

export default React.createClass({
    render: function () {
        var {action, user, item} = this.props.action;
        var username = _.get(user, 'username', '[Gelöscht]');

        var a = actions[action.group][action.label];

        var createdAt = moment(action.updatedAt).format('HH:MM');

        var dict = {
            username: username,
            createdAt: createdAt,
            points: action.points
        };
        var body = (
            <span>
                <h5>{username} {a.text}</h5>
                <hr />
                <p>{t.stats.actions.body(dict)}</p>
            </span>
        );

        var icon = (
            <Icon
                image={a.icon}
                type='none'
                fill={a.fill}
            />
        );

        return (
            <IconCard xs={12} md={12} icon={icon} body={body}/>
        );
    }
});
