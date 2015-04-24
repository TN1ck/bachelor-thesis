import Reflux from 'reflux';

var actions = Reflux.createActions([
	'changeSort',
    'addItem',
    'loadItems',
    'upvoteItem',
    'downvoteItem',
    'favouriteItem',
    'addQuery',
    'removeQuery',
    'changedQueries',
    'addDomElement'
]);

export default actions;
