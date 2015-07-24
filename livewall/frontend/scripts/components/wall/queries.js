import React      from 'react/addons';
import Reflux     from 'reflux';
import _          from 'lodash';

import actions    from '../../actions/actions.js';
import dataStore  from '../../stores/data.js';
import queryStore from '../../stores/queries.js';

var Query = React.createClass({
    displayName: 'query',
    createIcon: function () {
        var loading = _.some(this.props.query.broker, b => {
            return b.status === 'pending';
        });

        if (loading) {
            return <span className="fa-gear fa-spin"></span>;
        } else {
            return <span className="fa-remove"></span>;
        }
    },
    render: function () {

        var query = this.props.query;
        var color = query.color;

        return (
            <li style={{backgroundColor: color, borderColor: color}} className='query__element'>
                <div className='query__container'>
                    <div className='query__term'>{query.term}</div>
                    <div className='query__button'
                        onClick={this.props.removeQuery}>
                        {this.createIcon()}
                    </div>
                </div>
            </li>
        );
    }
});

var AddQuery = React.createClass({
    displayName: 'add-query',
    shouldComponentUpdate: function () {
        return false;
    },
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

export default React.createClass({
    displayName: 'queries',
    mixins: [Reflux.connect(queryStore, 'queries')],
    removeQuery: function (query) {
        actions.removeQuery(query);
    },
    addQuery: function (result) {
        actions.addQuery(result, true, true);
    },
    createQueries: function () {
        var queries = _.map(this.state.queries, (s, k) => {
            return <Query
                removeQuery={() => this.removeQuery(k)}
                query={s}/>;
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
