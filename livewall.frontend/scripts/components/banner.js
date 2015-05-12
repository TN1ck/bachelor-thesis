'use strict';

import React from 'react/addons';

import _ from 'lodash';

import actions from '../actions.js';
import {SETTINGS} from '../settings.js';
import {dataStore} from '../stores/data.js';
import {colorLuminance, parseColor} from '../utils.js';
import {user, requireAuth} from '../auth.js';

// import {ReactSourceSelect, ReactSource} from './sources.js';

export var Banner = React.createClass({
    displayName: 'badges',
    getDefaultProps: function() {
        return {
            text: 'kein Text gesetzt'
        }
    },
    render: function () {

        return (
            <svg width="100%" height="120px" viewBox="0 0 1044 120" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <path d="M850,1 L1044,1 L991.078293,51 L1044,101 L850,101 L850,1 Z" id="Rectangle-12" fill="#EE9F1C"></path>
                    <path d="M-0.342990043,1 L193.65701,1 L140.735303,51 L193.65701,101 L-0.342990043,101 L-0.342990043,1 Z" id="Rectangle-12-Copy" fill="#EE9F1C" transform="translate(96.657010, 51.000000) rotate(-180.000000) translate(-96.657010, -51.000000) "></path>
                    <path d="M144.175166,18.7175087 L195.7586,1.01504674 L195.758601,95.130571 L144.175166,18.7175087 Z" id="Path-1" fill="#D48503"></path>
                    <path d="M849,17.7024619 L900.583435,0 L900.583435,94.1155243 L849,17.7024619 Z" id="Path-1-Copy" fill="#D48503" transform="translate(874.791717, 45.853225) scale(-1, 1) translate(-874.791717, -45.853225) "></path>
                    <rect id="Rectangle-11" fill="#F6A623" x="141" y="20" width="765" height="100"></rect>
                    <text id="TROPHÄEN" font-family="Lato" x="522" y="88" fontSize="50" fontWeight="normal" style={{textAnchor: 'middle'}} fill="#FFFFFF">
                        {this.props.text}
                    </text>
                </g>
            </svg>
        );
    }
});
