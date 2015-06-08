import Pia from './PiaAgent.js';

export default class PiaHaus extends Pia {
    constructor (query, filter) {
        super(query, filter);
        this.broker = {
            name: 'service',
            public: false
        };
    }
}
