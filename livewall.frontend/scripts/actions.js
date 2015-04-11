import Reflux from 'reflux';

var actions = Reflux.createActions([
    'addItem',
    'loadItems',
    'upvoteItem',
    'downvoteItem',
    'favouriteItem',
    'addQuery',
    'removeQuery',
    'changedQueries'
]);

export default actions;
