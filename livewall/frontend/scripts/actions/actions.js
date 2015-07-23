import Reflux from 'reflux';

var actions = Reflux.createActions([
	// layoutstore
	'changeSort',
	'relayout',
    'addDomElement',

	// datastore
	'addItems',
	'voteItem',
    'favouriteItem',

	// queries
    'addQuery',
    'removeQuery',

	// messages
	'addFlashMessage',

	// gamification
	'buyBooster',

	// auth
	'login',
	'logout'
]);

export default actions;
