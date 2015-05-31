'use strict';

import React from 'react/addons';

import _ from 'lodash';

import actions from '../../actions.js';
import {SETTINGS} from '../../settings.js';
import {gameStore} from '../../stores/game.js';
import {camelCaseToBar} from '../../utils.js';
import {user, requireAuth} from '../../auth.js';

// import {ReactSourceSelect, ReactSource} from './sources.js';

import {Badge} from './badges.js';
import {Banner} from './banner.js';

export var ReactTrophies = React.createClass({
    displayName: 'badges',
    render: function () {

        var randomPoints = _.range(15).map(d => {
            var points = _.random(100, 20000);
            return <div className='trophies__points__splitted'>
                <span className='trophies__points__splitted__points'>{points} Punkte</span>
                <span className='trophies__points__splitted__text'> durch {Math.round(points/100)} Aktionen</span>
            </div>;
        });

        var badges = [
            {
                name: 'ANMELDUNG',
                number: '1',
                type: 'none',
                fill: '#9c4274',
                image: '/assets/key.png',
            },
            {
                name: 'TAGE IN FOLGE',
                number: '3',
                type: 'none',
                fill: '#F5A623',
                image: '/assets/repeat.png',
            },
            {
                name: 'TAGE IN FOLGE',
                number: '7',
                type: 'king',
                fill: '#F5A623',
                image: '/assets/repeat.png',
            },
            {
                name: 'TAGE IN FOLGE',
                number: '15',
                type: 'emperor',
                fill: '#F5A623',
                image: '/assets/repeat.png',
            },
            {
                name: 'UPVOTES',
                number: '10',
                type: 'none',
                fill: '#96bf48',
                image: '/assets/upvote.png',
            },
            {
                name: 'UPVOTES',
                number: '100',
                type: 'king',
                fill: '#96bf48',
                image: '/assets/upvote.png',
            },
            {
                name: 'UPVOTES',
                number: '1000',
                type: 'emperor',
                fill: '#96bf48',
                image: '/assets/upvote.png',
            },
            {
                name: 'DOWNVOTES',
                number: '10',
                type: 'none',
                fill: '#ec663c',
                image: '/assets/downvote.png',
            },
            {
                name: 'DOWNVOTES',
                number: '100',
                type: 'king',
                fill: '#ec663c',
                image: '/assets/downvote.png',
            },
            {
                name: 'DOWNVOTES',
                number: '1000',
                type: 'emperor',
                fill: '#ec663c',
                image: '/assets/downvote.png',
            },
            {
                name: 'SUCHEN',
                number: '100',
                type: 'none',
                fill: '#47bbb3',
                image: '/assets/search.png',
            },
            {
                name: 'SUCHEN',
                number: '1000',
                type: 'king',
                fill: '#47bbb3',
                image: '/assets/search.png',
            },
            {
                name: 'SUCHEN',
                number: '10000',
                type: 'emperor',
                fill: '#47bbb3',
                image: '/assets/search.png',
            },
            {
                name: 'FAVORITEN',
                number: '10',
                type: 'none',
                fill: '#248EE6',
                image: '/assets/star.png',
            },
            {
                name: 'FAVORITEN',
                number: '100',
                type: 'king',
                fill: '#248EE6',
                image: '/assets/star.png',
            },
            {
                name: 'FAVORITEN',
                number: '1000',
                type: 'emperor',
                fill: '#248EE6',
                image: '/assets/star.png',
            }
        ].map(x => {
            return (
                <div className="trophies__trophy">
                    <Badge image={x.image} text={x.name} number={x.number} type={x.type} fill={x.fill}/>
                </div>
                );
        });

        return (
            <div className='container'>
                <div className='trophies__banner'><Banner text="Trophäen"/></div>
                <div className='text-center'>
                    <p>Hier Findest du alle Trophäen die du bekommen hast, durch jede Trophäe werden dir Punkte auf deinen Punktestand gutgeschrieben.</p>
                </div>
                {badges}
                <div className='trophies__banner'><Banner text="Punkte"/></div>
                <div>
                    <div className='tropies__points'>
                        <div className='trophies__points__points'>500000</div>
                        <div className='trophies__points__splitted__container'>
                            <div className='trophies__points__splitted'>
                                <span className='trophies__points__splitted__points'>5000 Punkte</span>
                                <span className='trophies__points__splitted__text'> durch 20 tägliche Anmeldungen</span>
                            </div>
                            {randomPoints}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});
