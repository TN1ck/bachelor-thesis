import React                     from 'react/addons';
import Reflux                    from 'reflux';
import { RouteHandler }          from 'react-router';
import { Col, Row, Grid }        from 'react-bootstrap';
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

import messageStore              from '../../stores/messages.js';
import MessageCard               from './message.js';

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
    createMessages: function () {
        return this.state.messages.map(message => {
            return <Message message={message} />
        });
    },
    render: function () {
        return (
            <div className='messages'>
                <ReactCSSTransitionGroup transitionName="fade" transitionAppear={true} transitionEnter={true}>
                    {this.createMessages()}
                </ReactCSSTransitionGroup>
            </div>
        );
    }
});
