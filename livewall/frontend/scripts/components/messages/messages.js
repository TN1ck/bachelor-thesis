import React               from 'react/addons';
import Reflux              from 'reflux';
import { RouteHandler }    from 'react-router';
import { Col, Row, Grid }        from 'react-bootstrap';
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

import messageStore        from '../../stores/messages.js';

import MessageCard from './message.js';

var Message = React.createClass({
    render: function () {
        return (
            <MessageCard message={this.props.message} />
        );
    }
});

export default React.createClass({
    mixins: [
        Reflux.connect(messageStore)
    ],
    render: function () {
        var messages = this.state.messages.map(message => {
            return <Message message={message} />
        })
        return (
            <div className='messages'>
                <ReactCSSTransitionGroup transitionName="fade" transitionAppear={true} transitionEnter={true}>
                    {messages}
                </ReactCSSTransitionGroup>
            </div>
        );
    }
});
