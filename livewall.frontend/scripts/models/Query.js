import moment             from 'moment';
import {user}             from '../auth.js';
import {getColorByString} from '../colors.js';
import Broker     from './Broker.js';

export default class Query {

    constructor (term, brokerSettings) {
        this.term = term;
        this.date = moment();
        this.color = getColorByString(term);
        this.brokerSettings = brokerSettings;

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

    loadData () {

        var promises = this.broker.map(agent => {
            return agent.getData(user);
        });

        return promises;

    }

    valueOf () {
        return this.term;
    }

}
