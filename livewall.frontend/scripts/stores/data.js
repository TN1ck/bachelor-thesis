import _          from 'lodash';
import Reflux     from 'reflux';
import Immutable  from 'immutable';
import jquery     from 'jquery';
import moment     from 'moment';

import actions    from '../actions.js';
import {user}     from '../auth.js';
import {SETTINGS} from '../settings.js';


//
// ITEM STORE
//

export default Reflux.createStore({

    init: function () {

        this.items = Immutable.OrderedMap();

        this.profile = {
            queries: {},
            favourites: {}
        };

        this.listenTo(actions.addItems, this.addItems);

        this.listenTo(actions.upvoteItem,   this.upvoteItem);
        this.listenTo(actions.downvoteItem, this.downvoteItem);

        this.listenTo(actions.favouriteItem, this.favouriteItem);
        this.listenTo(actions.removeQuery,   this.removeQuery);


    },

    matchFavourites: function () {
        this.items = this.items.map((item) => {
            var uuid = item.get('uuid')
            if (this.profile.favourites[uuid]) {
                item = item.set('favourite', true);
            }
            return item;
        });
    },

    loadProfile: function () {
        user.profile().then((result) => {
            this.profile.queries = result.queries;
            this.profile.favourites = result.favourites;
            this.triggerState();
        });
    },

    filterItem: function (item) {
        return _.some(SETTINGS.FILTER, (v, k) => {
            return _.some(v, (filter) => {
                var contentToBeFiltered = JSON.stringify(item.get(k));
                return contentToBeFiltered.toLowerCase().indexOf(filter.toLowerCase()) > -1;
            })
        })
    },

    triggerState: function () {
        this.matchFavourites();
        this.trigger(this.items);
    },

    //
    // TILE HANDLING
    //

    addItems: function (items) {

        items.forEach(item => {
            if (this.filterItem(item)) {
                console.log('filtered item ', item.toJS());
                return;
            }

            this.items = this.items.set(item.get('uuid'), item);
        });

        this.triggerState();
    },

    //
    // REMOVE QUERY
    //

    removeQuery: function (queryTerm) {

        this.items = this.items.filter((item) => {
            var result = item.get('query').term !== queryTerm;
            return result;
        });

        this.triggerState();
    },

    //
    // UPVOTE & DOWNVOTES
    //

    upvoteItem: function (uuid) {
        var item = this.items.get(uuid).update('score', x => { return x + 1; });
        this.items = this.items.set(item.get('uuid'), item);
        this.triggerState.bind(this)(this.items);
    },

    downvoteItem: function (uuid) {
        var item = this.items.get(uuid).update('score', x => { return x - 1; });
        this.items = this.items.set(item.get('uuid'), item);
        this.triggerState.bind(this)(this.items);
    },

    //
    // FAVOURITE
    //

    favouriteItem: function (uuid) {
        var item = this.items.get(uuid);
        var favourite = item.get('favourite');

        var successCallback = () => {
            var itemNew = item.set('favourite', !favourite);
            this.items = this.items.set(item.get('uuid'), itemNew);
            this.loadProfile();
        };

        var failCallback = () => {
        };

        var fn = favourite ? 'unfavourite' : 'favourite';

        user[fn](item)
            .then(successCallback)
            .fail(failCallback);

    }

});
