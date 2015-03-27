import Reflux from 'reflux';

var actions = Reflux.createActions([
    'addItem',
    'loadItems',
    'upvoteItem',
    'addSource',
    'removeSource',
    'changedSources'
]);

export default actions;
