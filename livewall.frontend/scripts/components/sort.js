'use strict';

import _ from 'lodash';

import React from 'react/addons';
import Reflux from 'reflux';

import actions from '../actions.js';
import {sorters} from '../stores/layout.js';

export var ReactSort = React.createClass({
    displayName: 'sort',
    getInitialState: function () {
        return {
            sorters: sorters,
            selected: 'score'
        }
    },
    handleChange: function (e) {
        var newValue = this.refs.sortSelect.getDOMNode().value;
        this.setState({selected: newValue});
        actions.changeSort(newValue)
    },
    render: function () {

        var options = _.map(this.state.sorters, (v, k) => <option value={k}>{k}</option>);

        return (
            <div className='sort'>
                <select value={this.state.selected} ref="sortSelect" onChange={this.handleChange}>
                    {options}
                </select>
            </div>
        );
    }
});
