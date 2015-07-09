import Reflux from 'reflux';

var actions = Reflux.createActions([
	// layoutstore
	'changeSort',
	'relayout',
    'addDomElement',

	// datastore
    'addItem',
	'addItems',
    'loadItems',
	'voteItem',
    'favouriteItem',

	// queries
    'addQuery',
    'removeQuery',
    'changedQueries',

	// messages
	'addFlashMessage',

	// gamification
	'buyBooster',

	// auth
	'login',
	'logout'
]);

export default actions;
