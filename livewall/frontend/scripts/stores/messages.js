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
        this.messages = [];
        this.listenTo(actions.addFlashMessage, this.addFlashMessage);

    },

    addFlashMessage: function (message) {
        this.messages.push(message);
    }

});
