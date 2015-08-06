import React                     from 'react/addons';
import Reflux                    from 'reflux';
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

import messageStore              from '../../stores/messages.js';
import MessageCard               from './message.js';

/**
 * Shows the messages from the message-store
 */
export default React.createClass({
    displayName: 'Messages',

    mixins: [Reflux.connect(messageStore)],

    createMessages: function () {
        return this.state.messages.map(message => {
            return <MessageCard message={message}/>;
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
