'use strict';

import React from 'react/addons';
import Reflux from 'reflux';

import actions from '../actions.js';
import {dataStore} from '../stores.js';
import {camelCaseToBar, hashCode, colors} from '../utils.js';

export var ReactSearch = React.createClass({
    displayName: 'search',
    render: function () {

        var errors  = 0;
        var loaded = 0;
        var numberOfAgents = this.props.search.agents.length;

        this.props.search.agents.forEach(agent => {
            errors += agent.error ? 1 : 0;
            loaded += agent.loaded ? 1 : 0;
        });

        var loading = <span> {loaded}/{numberOfAgents} <span className="fa-gear fa-spin"></span></span>;
        var remove = <span className="fa-remove"></span>;

        var error;
        if (errors > 0) {
            // error = <div className='querie-search querie-search__error'>{errors}/{numberOfAgents} Anfragen fehlerhaft</div>
        }

        var color = colors[hashCode(this.props.search.name) % colors.length];

        return (
            <li style={{'background-color': color, 'border-color': color}} className='querie-element'>
                <div className='querie-container'>
                    <div className='querie-term'>{this.props.search.name}</div>
                    {error}
                    <div className='querie-button' onClick={this.props.removeSearch}>{((loaded === numberOfAgents) || errors > 0)? remove : loading}</div>
                </div>
            </li>
        );
    }
});

export var ReactAddSearch = React.createClass({
    displayName: 'add-search',
    handleSubmit: function (e) {

        e.preventDefault();
        var search         = this.refs.search.getDOMNode().value;
        this.props.submitCallback(search);

    },
    render: function () {
        return (
            <form className='querie-element' onSubmit={this.handleSubmit}>
                <div className='querie-container'>
                    <div className='querie-input'>
                        <input required ref='search'></input>
                    </div>
                    <button className='querie-add'>
                    </button>
                </div>
            </form>
        );
    }
});

export var ReactSearches = React.createClass({
    displayName: 'searches',
    mixins: [Reflux.listenTo(actions.changedSearches, 'onSearchChange')],
    getInitialState: function () {
        return {
            searches: dataStore.searches,
        }
    },
    onSearchChange: function (searches) {
        this.setState({
            searches: searches
        })
    },
    removeSearch: function (search) {
        actions.removeSearch(search);
    },
    submitCallback: function (result) {
        actions.addSearch(result);
    },
    render: function () {
        var searchNames = _.map(this.state.searches, (s, k) => <ReactSearch removeSearch={this.removeSearch.bind(this, k)} key={k} search={s}/>);
        return (
            <div className='queries'>
                <ul className='queries-list'>
                    {searchNames}
                </ul>
                <ReactAddSearch submitCallback={this.submitCallback}></ReactAddSearch>
            </div>
        );
    }
});
