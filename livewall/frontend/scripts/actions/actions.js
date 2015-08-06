import Reflux from 'reflux';

/**
 * All actions that are used in the application
 */
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
