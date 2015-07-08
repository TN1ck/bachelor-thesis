import _          from 'lodash';
import Reflux     from 'reflux';
import jquery     from 'jquery';
import moment     from 'moment';

import actions    from '../actions/actions.js';
import {user}     from '../auth.js';
import SETTINGS   from '../settings.js';

//
// FLASH MESSAGE STORE
//

export default Reflux.createStore({

    init: function () {
        this.duration = 5;
        this.isRunnig = false;
        this.state = {
            messages: []
        };
        this.listenTo(actions.addFlashMessage, this.addFlashMessage);

    },

    getInitialState: function () {
        return this.state;
    },

    triggerState: function () {
        this.trigger({
            messages: this.state.messages.slice(0, 1)
        });
    },

    addFlashMessage: function (message) {
        message.duration = this.duration;
        this.state.messages.push(message);
        if (!this.isRunning) {
            this.showAndDestroy();
        }
    },

    showAndDestroy: function () {
        this.isRunning = true;
        this.triggerState();
        setTimeout(() => {
            this.state.messages.shift();
            if (this.state.messages.length !== 0) {
                setTimeout(() => {
                    this.showAndDestroy();
                }, 500)
            } else {
                this.triggerState();
                this.isRunning = false;
            }
        }, this.duration * 1000);
    }

});
