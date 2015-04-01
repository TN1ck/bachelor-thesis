import Reflux from 'reflux';

var actions = Reflux.createActions([
    'addItem',
    'loadItems',
    'upvoteItem',
    'addSearch',
    'removeSearch',
    'changedSearches'
]);

export default actions;
