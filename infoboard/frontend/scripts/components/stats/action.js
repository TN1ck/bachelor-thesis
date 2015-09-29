import React       from 'react';
import moment      from 'moment';
import _           from 'lodash';

import {colors}    from '../../../shared/util/colors.js';

import IconCard    from '../utility/iconcard.js';
import Icon        from '../utility/icon.js';

// specifies how we visualize each action-type
var actions = {
    auth: {
        login: {
            text: '.stats.actions.auth.login',
            icon: 'key',
            fill: colors.vinrouge
        }
    },
    query: {
        add: {
            text: '.stats.actions.query.add',
            icon: 'query',
            fill: colors.buttercup
        },
        remove: {
            text: '.stats.actions.query.remove',
            icon: 'query',
            fill: colors.buttercup
        }
    },
    favourite: {
        toggle: {
            text: '.stats.actions.query.favourite',
            icon: 'star',
            fill: colors.curious_blue
        }
    },
    vote: {
        up: {
            text: '.stats.actions.vote.up',
            icon: 'upvote',
            fill: colors.sushi
        },
        down: {
            text: '.stats.actions.vote.down',
            icon: 'downvote',
            fill: colors.burnt_sienna
        }
    }
};

/**
 * Creates a visualization of an action
 */
export default React.createClass({
    render: function () {
        var {action, user} = this.props.action;
        var username = _.get(user, 'username', '[Gelöscht]');

        var a = actions[action.group][action.label];
        var t = this.props.translation;

        var createdAt = moment(action.createdAt).format('H:mm');

        var dict = {
            username: username,
            createdAt: createdAt,
            points: action.points
        };

        var body = (
            <span>
                <h5>{username} {_.get(t, a.text)}</h5>
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
