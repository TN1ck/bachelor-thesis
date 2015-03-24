import Reflux from 'reflux';

var actions = Reflux.createActions([
    'login',
    'loginViaCookie',
    'logout',
    'addItem',
    'loadItems',
    'upvoteItem',
    'addSource',
    'removeSource',
    'changedSources'
]);

export default actions;
