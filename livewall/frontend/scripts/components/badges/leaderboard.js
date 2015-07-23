import React from 'react';
import _     from 'lodash';
import {
    Grid, Row, Col, Input, Button,
    Jumbotron, Alert, PageHeader, Badge,
    Table, Well
} from 'react-bootstrap';

import t from '../../../shared/translations/translation.js';

export default React.createClass({
    render: function () {
        var users = this.props.users;
        var highlightUser = this.props.user;

        //
        // remove user, sort and take only the 50 best, add the user again
        //

        // remove user
        //

        if (highlightUser) {
            var place = highlightUser.place;
            var length = users.length;

            users = _.slice(users, Math.max(place - 5, 0), (place + 5))
        }


        var sortFn = (a, b) => b.points.all - a.points.all;

        // sort and take best 20

        users = users.sort(sortFn).slice(0, 20);

        users = users.sort(sortFn);

        var list = users.map(_user => {
            var {points, badges, actions} = _user;
            var name = _user.username;

            var _badges = badges.length;

            var trClass = ''

            if (highlightUser && name === highlightUser.username) {
                trClass = 'active';
            }

            return (
                <tr className={trClass}>
                    <td className='vert-align leaderboard__place'    xs={3}>#{_user.place}</td>
                    <td className='vert-align leaderboard__name'     xs={3}>{name}</td>
                    <td className='vert-align leaderboard__points'   xs={3}>{points.all}</td>
                    <td className='vert-align leaderboard__badges'   xs={3}>{_badges}</td>
                </tr>
            );
        });

        return (
            <Table className='leaderboard' hover striped>
                <thead>
                    <tr>
                        <th>{t.label.place}</th>
                        <th>{t.label.name}</th>
                        <th>{t.label.points}</th>
                        <th>{t.label.badges}</th>
                    </tr>
                </thead>
                <tbody>
                {list}
                </tbody>
            </Table>
        );
    }
});
