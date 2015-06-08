import React      from 'react/addons';
import Reflux     from 'reflux';

import actions    from '../../actions.js';
import dataStore  from '../../stores/data.js';
import queryStore from '../../stores/queries.js';

export var ReactQuery = React.createClass({
    displayName: 'query',
    render: function () {

        var errors  = 0;
        var loaded = 0;
        var numberOfAgents = this.props.query.agents.length;

        this.props.query.agents.forEach(agent => {
            errors += agent.error ? 1 : 0;
            loaded += agent.loaded ? 1 : 0;
        });

        var loading = <span className="fa-gear fa-spin"></span>;
        var remove  = <span className="fa-remove"></span>;
        var color   = this.props.query.color;

        return (
            <li style={{'background-color': color, 'border-color': color}} className='query__element'>
                <div className='query__container'>
                    <div className='query__term'>{this.props.query.term}</div>
                    <div className='query__button' onClick={this.props.removeQuery}>{((loaded === numberOfAgents) || errors > 0)? remove : loading}</div>
                </div>
            </li>
        );
    }
});

export var ReactAddQuery = React.createClass({
    displayName: 'add-query',
    handleSubmit: function (e) {

        e.preventDefault();
        var query = this.refs.query.getDOMNode().value;
        this.props.submitCallback(query);

    },
    render: function () {
        return (
            <form className='query__element' onSubmit={this.handleSubmit}>
                <div className='query__container'>
                    <div className='query__input'>
                        <input required ref='query'></input>
                    </div>
                    <button className='query__add'>
                    </button>
                </div>
            </form>
        );
    }
});

export var ReactQueries = React.createClass({
    displayName: 'queries',
    mixins: [Reflux.listenTo(queryStore, 'onStoreChange')],
    onStoreChange: function (queries) {
        this.setState({
            queries: queries
        })
    },
    getInitialState: function () {
        return {
            queries: []
        };
    },
    removeQuery: function (query) {
        actions.removeQuery(query);
    },
    submitCallback: function (result) {
        actions.addQuery(result, true, true);
    },
    render: function () {
        var queryNames = _.map(this.state.queries, (s, k) => {
            return <ReactQuery
                removeQuery={this.removeQuery.bind(this, k)}
                key={k}
                query={s}/>;
        });
        return (
            <div className='queries'>
                <ul className='queries--list'>
                    {queryNames}
                </ul>
                <ReactAddQuery submitCallback={this.submitCallback}></ReactAddQuery>
            </div>
        );
    }
});
