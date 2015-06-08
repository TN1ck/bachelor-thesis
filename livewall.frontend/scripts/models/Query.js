import moment             from 'moment';
import {user}             from '../auth.js';
import {getColorByString} from '../colors.js';

export default class Query {

    constructor (term, agentSources) {
        this.term = term;
        this.date = moment();
        this.color = getColorByString(term);
        this.agentSources = agentSources;

        this.initAgents();

        return this;
    }

    initAgents (agents) {
        this.agents = this.agentSources.map(source => {
            return new source(this.term);
        });

        return this;
    }

    abort () {
        this.agents.forEach(agent => {
            agent.abort();
        });
    }

    loadData () {

        var promises = this.agents.map(agent => {
            return agent.getData(user);
        });

        return promises;

    }

    valueOf () {
        return this.term;
    }

}
