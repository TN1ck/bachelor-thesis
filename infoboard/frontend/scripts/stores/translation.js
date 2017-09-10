import Reflux     from 'reflux';

import actions    from '../actions/actions.js';
import SETTINGS   from '../settings.js';


/**
 * The TranslationStore will provide all translation-texts used in the application.
 */
export default Reflux.createStore({

    /**
     * Initialize the TransaltionStore
     */
    init: function () {

        var lang = SETTINGS.LANGUAGE;

        // if it is not set, detect it
        // if (!lang) {
        //     var locale = require('browser-locale')();
        //     lang = SETTINGS.LANGUAGE_DEFAULT;
        //     if (locale.toLowerCase().indexOf('en') > -1) {
        //         lang = 'en';
        //     }
        // }

        this.state = {
            translations: require('../../shared/translations'),
            language: lang
        };

        this.listenTo(actions.changeLanguage,  this.changeLanguage);

    },

    /**
     * Returns the initial state
     * @returns {Object} The initial state
     */
    getInitialState: function () {
        return this.getCurrentTranslation();
    },

    /**
     * Set the used langugae and trigger a state change
     * @param {String} lang The language-string
     */
    changeLanguage: function (lang) {
        this.state.language = lang;
        // save the selection
        SETTINGS.save('LANGUAGE', lang);
        this.trigger(this.getCurrentTranslation());
    },

    /**
     * Returns the currently used translation-file
     */
    getCurrentTranslation: function () {
        return (this.state.translations[this.state.language]
             || this.state.translations[SETTINGS.DEFAULT_LANGUAGE]).file;
    }

});
