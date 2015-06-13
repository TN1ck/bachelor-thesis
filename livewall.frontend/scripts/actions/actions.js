import Reflux from 'reflux';

var actions = Reflux.createActions([
	'changeSort',
	'relayout',
    'addItem',
    'loadItems',
    'upvoteItem',
    'downvoteItem',
    'favouriteItem',
    'addQuery',
    'removeQuery',
    'changedQueries',
    'addDomElement',

	'addItems'
]);

export default actions;
