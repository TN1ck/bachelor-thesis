import moment             from 'moment';
import store              from 'store';
import _                  from 'lodash';
import $                  from 'jquery';

import {getColorByString} from '../../shared/util/colors.js';
import {user}             from '../auth.js';
import SETTINGS           from '../settings.js';
import Broker             from './Broker.js';

export default class Query {

    constructor (term, broker) {
        this.term = term;
        this.date = moment();
        this.color = getColorByString(term, SETTINGS.color_scheme);
        this.brokerSettings = broker;

        this.initBroker();

        return this;
    }

    initBroker (agents) {
        this.broker = this.brokerSettings.map(b => {
            return new Broker(b, this.term);
        });

        return this;
    }

    abort () {
        this.broker.forEach(b => {
            b.abort();
        });
    }

    readData () {
        return store.get(`query-${this.term}`) || [];
    }

    loadData () {

        var promises = this.broker.map(b => {
            return b.getData(user);
        });

        $.when(...promises).then((...results) => {
            this.saveData(_.flatten(results));
        });

        return promises;

    }

    saveData (items) {
        try {
            store.set(`query-${this.term}`, items);
        } catch (e) {
            console.log(e);
        }
    }

    valueOf () {
        return this.term;
    }

}
