import React       from 'react';

import t from '../../../shared/translations/translation.js';
import {colors} from '../../../shared/util/colors.js';

import IconCard from '../utility/iconcard.js';
import Award    from '../trophies/awards.js';

export default React.createClass({
    render: function () {
        var {action, user, item} = this.props.action;

        var actions = {
            auth: {
                login: {
                    text: 'hat sich angemeldet.',
                    icon: '/assets/key.png',
                    fill: colors.vinrouge
                }
            },
            search: {
                add: {
                    text: 'hat nach etwas gesucht.',
                    icon: '/assets/search.png',
                    fill: colors.buttercup
                },
                remove: {
                    text: 'hat eine Suche entfernt.',
                    icon: '/assets/search.png',
                    fill: colors.buttercup
                },
            },
            favourite: {
                toggle: {
                    text: 'hat etwas favorisiert.',
                    icon: '/assets/star.png',
                    fill: colors.curious_blue
                }
            },
            vote: {
                up: {
                    text: 'hat etwas positiv bewertet.',
                    icon: '/assets/upvote.png',
                    fill: colors.sushi
                },
                down: {
                    text: 'hat etwas negativ bewertet.',
                    icon: '/assets/downvote.png',
                    fill: colors.burnt_sienna
                }
            }
        };

        var a = actions[action.group][action.label];

        var body = (
            <span>
                <h5>{user.username} {a.text}</h5>
                <hr />
                <p>
                    Dies Aktion wurde um {action.creaetedAt} ausgeführt.
                    Sie hat {user.username} {action.points} Punkte erbracht.
                </p>
            </span>
        );

        var icon = (
            <Award
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
