import Reflux from 'reflux';

var actions = Reflux.createActions([
	'changeSort',
	'relayout',
    'addItem',
    'loadItems',
	'voteItem',
    'favouriteItem',
    'addQuery',
    'removeQuery',
    'changedQueries',
    'addDomElement',

	'addItems',

	'addFlashMessage'
]);

export default actions;
