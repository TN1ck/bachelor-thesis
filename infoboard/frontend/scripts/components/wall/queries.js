import React      from 'react/addons';
import Reflux     from 'reflux';
import _          from 'lodash';

import Query      from '../../models/Query.js';
import actions    from '../../actions/actions.js';
import queryStore from '../../stores/queries.js';

/**
 * React-Compnonent that visualizes a query with its request-state
 */
var QueryComponent = React.createClass({
    displayName: 'Query',

    propTypes: {
        query: React.PropTypes.instanceOf(Query).isRequired,
        remove: React.PropTypes.func.isRequired
    },

    /**
     * Returns the correct icon of the query with respect to the request-state
     * @returns {React.ProptTypes.element} The icon
     */
    createIcon: function () {
        var loading = _.some(this.props.query.broker, b => {
            return b.status === 'pending';
        });

        return (
            <span className={`${loading ? 'fa-gear fa-spin' : 'fa-remove'}`}>
            </span>
        );
    },

    render: function () {

        var query = this.props.query;
        var remove = this.props.remove;
        var color = query.color;

        return (
            <li style={{backgroundColor: color, borderColor: color}} className='query__element'>
                <div className='query__container'>
                    <div className='query__term'>{query.term}</div>
                    <div className='query__button'
                        onClick={remove}>
                        {this.createIcon()}
                    </div>
                </div>
            </li>
        );
    }
});

/**
 * React-Compnonent with an input-field were new queries can be entered
 */
var AddQuery = React.createClass({
    displayName: 'AddQuery',

    propTypes: {
        submitCallback: React.PropTypes.func
    },

    shouldComponentUpdate: function () {
        return false;
    },

    handleSubmit: function (e) {

        e.preventDefault();
        var dom = this.refs.query.getDOMNode();
        var query = dom.value;
        dom.value = '';
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

/**
 * Will visualize all current queries with their state, as well draw
 * an input-field for entering new queries. Provides the needded callbacks
 * for deleting and creating queries
 */
export default React.createClass({
    displayName: 'Queries',

    // update when the queryStore changed
    mixins: [Reflux.connect(queryStore, 'queries')],

    removeQuery: function (query) {
        actions.removeQuery(query);
    },

    addQuery: function (result) {
        // true means that we want to track the action
        actions.addQuery(result, true);
    },

    /**
     * Create a Query-Component for every query
     * @returns {Component} List of queries
     */
    createQueries: function () {
        var queries = _.map(this.state.queries, (s, k) => {
            return (
                <QueryComponent key={k} remove={() => this.removeQuery(k)} query={s}/>
            );
        });

        return (
            <ul className='queries--list'>
                {queries}
            </ul>
        );
    },

    render: function () {
        return (
            <div className='queries'>
                {this.createQueries()}
                <AddQuery submitCallback={this.addQuery}/>
            </div>
        );
    }
});
