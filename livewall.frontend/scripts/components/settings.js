'use strict';

import React from 'react/addons';

import actions from '../actions.js';
import {SETTINGS} from '../settings.js';
import {dataStore} from '../stores.js';
import {camelCaseToBar} from '../utils.js';
import {user, requireAuth} from '../auth.js';

// import {ReactSourceSelect, ReactSource} from './sources.js';

export var ReactSettings = React.createClass({
    displayName: 'settings',
    getInitialState: function () {
        return {
            settings: SETTINGS
        }
    },
    render: function () {
        // var sources = this.state.settings.SOURCES.map(source => {
        //     var sourceHydrated = {
        //         source: {
        //             name: camelCaseToBar(source.name),
        //             search: source.search
        //         },
        //         loaded: true
        //     };
        //     return <ReactSource source={sourceHydrated}/>
        // });

        return (
            <div className='wall-settings fullpage'>
                <h1>Settings</h1>
                <p>Hier können Sie permanente Einstellungen an der DAI-wall vornehmen.
                Klicken Sie auf speichern um die Änderungen zu übernehmen.</p>
                <h2>Quellen</h2>
            </div>
        );
    }
});
