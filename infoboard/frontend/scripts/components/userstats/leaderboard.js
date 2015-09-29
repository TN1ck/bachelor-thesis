import React     from 'react';
import _         from 'lodash';
import { Table } from 'react-bootstrap';

/**
 * Leaderboard which supports the infinite and the user-centric view
 */
export default React.createClass({
    displayName: 'Leaderboard',

    propTypes: {
        user: React.PropTypes.object,
        users: React.PropTypes.arrayOf(React.PropTypes.object)
    },

    render: function () {
        var users = this.props.users;
        var highlightUser = this.props.user;
        var t = this.props.translation;

        // when a user is given we create the user-centric Leaderboard
        if (highlightUser) {
            var place = highlightUser.place;
            users = _.slice(users, Math.max(place - 5, 0), (place + 5));
        }

        var sortFn = (a, b) => a.place - b.place;

        // sort and take best 20
        users = users.sort(sortFn).slice(0, 20);

        // create the leaderboard
        var list = users.map(_user => {
            var {points, badges} = _user;
            var name = _user.username;

            var _badges = badges.length;

            var trClass = '';

            // if a user was given, highlight his row
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
