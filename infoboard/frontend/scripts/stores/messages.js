import Reflux     from 'reflux';

import actions    from '../actions/actions.js';

/**
 * The Messagestore handles flashmessages
 */
export default Reflux.createStore({

    /**
     * Initialization of the Messagestore, will set the inital state and create
     * listeners
     */
    init: function () {
        this.duration = 5;
        this.isRunnig = false;
        this.state = {
            messages: []
        };
        this.listenTo(actions.addFlashMessage, this.addFlashMessage);

    },

    /**
     * Returns the initial state
     * @returns {Object} The initial state
     */
    getInitialState: function () {
        return this.state;
    },

    /**
     * Triggers the first message in the queue
     */
    triggerState: function () {
        this.trigger({
            messages: this.state.messages.slice(0, 1)
        });
    },

    /**
     * Will add a message to the current queue, it will be shown after all
     * its successors were shown
     *
     * @param {Object} message The message that should be shown
     */
    addFlashMessage: function (message) {
        message.duration = this.duration;
        this.state.messages.push(message);
        if (!this.isRunning) {
            this.showAndDestroy();
        }
    },

    /**
     * Show the first message of the queue and destroy it after `this.duration` seconds
     */
    showAndDestroy: function () {
        this.isRunning = true;
        this.triggerState();
        setTimeout(() => {
            this.state.messages.shift();
            if (this.state.messages.length !== 0) {
                setTimeout(() => {
                    this.showAndDestroy();
                }, 500);
            } else {
                this.triggerState();
                this.isRunning = false;
            }
        }, this.duration * 1000);
    }

});
