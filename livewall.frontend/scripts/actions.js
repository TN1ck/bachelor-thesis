import Reflux from 'reflux';

var actions = Reflux.createActions([
    'addItem',
    'loadItems',
    'upvoteItem',
    'downvoteItem',
    'favouriteItem',
    'addSearch',
    'removeSearch',
    'changedSearches'
]);

export default actions;
