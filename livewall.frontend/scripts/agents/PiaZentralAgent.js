import Pia from './PiaAgent.js';

export default class PiaZentral extends Pia {
    constructor (query, filter) {
        super(query, filter);
        this.broker = {
            name: 'service',
            public: false
        };
    }
}
