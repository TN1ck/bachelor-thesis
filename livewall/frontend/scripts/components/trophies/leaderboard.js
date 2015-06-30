import React from 'react';
import _     from 'lodash';
import {
    Grid, Row, Col, Input, Button,
    Jumbotron, Alert, PageHeader, Badge,
    Table, Well
} from 'react-bootstrap';

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
            users = users.filter(x => {
                return x.user !== highlightUser.user;
            });
        }


        var sortFn = (a, b) => b.trophies.points - a.trophies.points;

        // sort and take best 20

        users = users.sort(sortFn).slice(0, 20);

        // add user
        if (highlightUser) {
            users = users.concat([highlightUser]).sort(sortFn);
        }

        users.sort((a, b) => {
            return b.trophies.points.all - a.trophies.points.all;
        })

        var list = users.map(_user => {
            var {results, trophies, points, place} = _user.trophies;
            var name = _user.user;

            // trophies = _.chain(trophies).map(x => {
            //     return _.find(badges, {id: x});
            // }).sortBy(x => -x.points.all).value();
            //
            //
            // var _trophies = trophies.map(x => {
            //     return <div className='trophies__leaderboard__trophies__container'>
            //         <Award
            //             center={true}
            //             image={x.image}
            //             text={x.name}
            //             number={x.number}
            //             type={x.type}
            //             fill={x.fill}/>
            //         </div>;
            // });

            var _trophies = trophies.length;

            var trClass = ''

            if (highlightUser && name === highlightUser.user) {
                trClass = 'active';
            }

            return <tr className={trClass}>
                <td className='vert-align trophies__leaderboard__place'    xs={3}>#{_user.place}</td>
                <td className='vert-align trophies__leaderboard__name'     xs={3}>{name}</td>
                <td className='vert-align trophies__leaderboard__points'   xs={3}>{points.all}</td>
                <td className='vert-align trophies__leaderboard__trophies' xs={3}>{_trophies}</td>
            </tr>;
        });

        return (
            <Table className='trophies__leaderboard' hover striped>
                <thead>
                    <tr>
                        <th>Platz</th>
                        <th>Name</th>
                        <th>Punkte</th>
                        <th>Trophäen</th>
                    </tr>
                </thead>
                <tbody>
                {list}
                </tbody>
            </Table>
        );
    }
});
