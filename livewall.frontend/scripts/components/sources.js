'use strict';

import React from 'react/addons';
import Reflux from 'reflux';

import actions from '../actions.js';
import {dataStore} from '../stores.js';
import {camelCaseToBar} from '../utils.js';

export var ReactSource = React.createClass({
    displayName: 'source',
    render: function () {
        var loading = <span className="fa-gear fa-spin"></span>;
        var remove = <span className="fa-remove"></span>;
        var error;
        if (this.props.source.error) {
            error = <div className='source-search source-search__error'>fehler beim laden</div>
        }

        return (
            <li>
                <div className='source-container'>
                    <div className='source-name'>
                        {this.props.source.source.name}
                    </div>
                    <div className='source-search'>{this.props.source.source.search}</div>
                    {error}
                    <div className='source-button' onClick={this.props.removeSource}>{(this.props.source.loaded || this.props.source.error) ? remove : loading}</div>
                </div>
            </li>
        );
    }
});

export var ReactSourceSelect = React.createClass({
    displayName: 'source-select',
    handleSubmit: function (e) {

        e.preventDefault();

        var selectedSource = this.refs.select.getDOMNode().value;
        var search         = this.refs.search.getDOMNode().value;
        console.log(search, selectedSource);
        this.props.submitCallback({search: search, source: selectedSource});

    },
    render: function () {
        var options = dataStore.availableSources.map(s => <option value={s.name}>{camelCaseToBar(s.name)}</option>);
        return (
            <form className='select-group-container' onSubmit={this.handleSubmit}>
                <div className='select-container'>
                    <select className='select' ref='select' defaultValue={"pia|zentral"}>
                        {options}
                    </select>
                </div>
                <div className='input'>
                    <input required ref='search'></input>
                </div>
                <button className='source-add'>
                </button>
            </form>
        );
    }
});

export var ReactSources = React.createClass({
    displayName: 'sources',
    mixins: [Reflux.listenTo(actions.changedSources, 'onSourceChange')],
    getInitialState: function () {
        return {
            sources: dataStore.sources,
        }
    },
    onSourceChange: function (sources) {
        this.setState({
            sources: sources
        })
    },
    removeSource: function (source) {
        actions.removeSource(source);
    },
    submitCallback: function (result) {
        actions.addSource(result);
    },
    render: function () {
        var sourceNames = _.map(this.state.sources, (s, k) => <ReactSource removeSource={this.removeSource.bind(this, s.source)} key={k} source={s}/>);
        return (
            <div className='sources'>
                <ul>
                    {sourceNames}
                </ul>
                <ReactSourceSelect submitCallback={this.submitCallback}></ReactSourceSelect>
            </div>
        );
    }
});
