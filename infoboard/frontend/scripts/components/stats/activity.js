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
            text: '.stats.actions.favourite.toggle',
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
 * Creates a visualization of an activity
 */
export default React.createClass({
    render: function () {

        var t = this.props.translation;

        var activity = this.props.activity;

        var activityDict, body, header;

        if (activity.type === 'action') {

            activityDict = actions[activity.data.group][activity.data.label];
            header = `${activity.username} ${_.get(t, activityDict.text)}`;

            body = t.stats.actions.body({
                username: activity.username || t.label.deleted,
                createdAt: moment(activity.createdAt).format('H:mm'),
                points: activity.points
            });

        }

        if (activity.type === 'badge') {

            activityDict = {
                fill: activity.data.fill,
                icon: activity.data.image,
                type: activity.data.type
            };

            header = `${activity.username} ${t.stats.badges.header}`;
            body = t.stats.badges.body({
                username: activity.username,
                why: _.get(t, activity.data.why)
            });
        }

        var iconBody = (
            <span>
                <h5>{header}</h5>
                <hr />
                <p>{body}</p>
            </span>
        );

        var icon = (
            <Icon
                image={activityDict.icon}
                type={activityDict.type}
                fill={activityDict.fill}
            />
        );

        return (
            <IconCard xs={12} md={12} icon={icon} body={iconBody}/>
        );
    }
});
