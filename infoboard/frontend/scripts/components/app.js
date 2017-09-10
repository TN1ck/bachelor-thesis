import React               from 'react/addons';
import {Alert}               from 'react-bootstrap';
import {RouteHandler}      from 'react-router';
import Reflux              from 'reflux';
import translationStore    from '../stores/translation.js';

import Header              from './layout/header.js';
import Messages            from './messages/messages.js';

/**
 * Component that serves as wrapper for the whole application, also provides
 * the translation files
 */
export default React.createClass({

    displayName: 'App',

    mixins: [Reflux.connect(translationStore, 'translation')],

    render: function () {
        return (
            <div>
                <div className="test-version">
                    {this.state.translation.testVersion.main}
                    <a href={this.state.translation.testVersion.link}>{this.state.translation.testVersion.link}</a>
                </div>
                <Header       translation={this.state.translation} />
                <Messages     translation={this.state.translation} />
                <RouteHandler translation={this.state.translation} />
            </div>
        );
    }
});
