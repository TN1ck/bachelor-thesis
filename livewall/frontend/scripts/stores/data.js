import _          from 'lodash';
import Reflux     from 'reflux';
import Immutable  from 'immutable';

import actions    from '../actions/actions.js';
import {user}     from '../auth.js';
import SETTINGS   from '../settings.js';

import * as api   from '../api/api.js';

/**
 * Itemstore. The Itemstore is a central piece of the application, it will
 * keep track of all items (an item is __one__ result of a query) that are fetched
 * by the QueryStore: handle the removement  of a query by a user (remove all items,
 * which are associated with the query), handle the favouriting and voting of an
 * item.
 *
 */
export default Reflux.createStore({

    /**
     * Initialization of the Itemstore, will set the inital state, create the listeners and
     * set the user-profile when it is sucessfully fetched.
     */
    init: function () {

        this.items = Immutable.OrderedMap();

        this.profile = {
            queries: {},
            favourites: {}
        };

        // elements will take longer to load, but it will increase the smoothness
        // will only be used for addItems
        // will group mulitple results into one trigger
        this.debouncedTriggerState = _.debounce(this.triggerState, 500);

        this.listenTo(actions.addItems,      this.addItems);
        this.listenTo(actions.voteItem,      this.voteItem);
        this.listenTo(actions.favouriteItem, this.favouriteItem);
        this.listenTo(actions.removeQuery,   this.removeQuery);

        user.whenProfileIsLoaded(this.setProfile.bind(this));

    },

    /**
     * Set every item that was favourited by the user as favourited.
     */
    matchFavourites: function () {
        this.items = this.items.map((item) => {
            var uuid = item.get('uuid');
            if (this.profile.favourites[uuid]) {
                item = item.set('favourite', true);
            }
            return item;
        });
    },

    /**
     * Saves the provided profile in the state and triggers a change.
     *
     * @param {{queries: Object, favourites: Object}} profile The user-profile
     */
    setProfile: function (profile) {
        this.profile.queries = profile.queries;
        this.profile.favourites = profile.favourites;
        this.triggerState();
    },

    /**
     * Check if the provided item must be filtered
     *
     * @param {Object} item The item that will be checked for the need of filtering
     * @returns
     */
    filterItem: function (item) {
        return !_.some(SETTINGS.FILTER, (v, k) => {
            return _.some(v, (filter) => {
                var contentToBeFiltered = JSON.stringify(item.get(k)) || item.get(k) || '';
                return contentToBeFiltered.toLowerCase().indexOf(filter.toLowerCase()) > -1;
            });
        });
    },

    /**
     * Filter the provided items, the filter is given by `filterItem`
     *
     * @param {Object[]} itmes The itmes that will be filtered
     */
    filterItems: function (items) {
        return items.filter(this.filterItem);
    },

    /**
     * Convience method that will trigger a change of `this.items`
     */
    triggerState: function () {
        this.matchFavourites();
        this.trigger(this.items);
    },

    /**
     * Will add the items, that fulfill the requirements, to the state. Every
     * item that was not filtered will be hydrated with its votes and actions.
     * Triggers a change when all items are hydrated.
     *
     * @param {Object[]} items The items that will be added to the state
     */
    addItems: function (items) {

        items = this.filterItems(items);

        // make a map out of the list
        var tempItems = {};

        items.forEach(item => {
            tempItems[item.get('uuid')] = item;
        });

        // all the uuids that will be checked by the backends for votes/actions
        var uuids = _.keys(tempItems).join(',');

        // get upvotes and actions of the tiles
        api.getItems(uuids).then(result => {

            // for each item in the response, hydrate the item with matching uuid
            // with the provided votes and actions
            result.items.forEach(item => {
                // sanity check if we have the item
                var _item = tempItems[item.uuid];
                if (_item) {

                    var votes = item.votes;

                    var ownVote = item.userVote;

                    // hydrate the item with its votes and actions
                    tempItems[item.uuid] = _item.merge({
                        votes: votes.sum,
                        ownVote: ownVote.value,
                        actions: item.Actions
                    });
                }
            });

            // add the new items
            this.items = this.items.merge(tempItems);

            // debounce the trigger
            this.debouncedTriggerState();
        });


    },

    /**
     * Remove all items which are associated with the query `queryTerm` and
     * trigger the state.
     *
     * @param {string} queryTerm The queryTerm which will be removed for the removal
     */
    removeQuery: function (queryTerm) {

        this.items = this.items.filter((item) => {
            var result = item.get('query').term !== queryTerm;
            return result;
        });

        this.triggerState();
    },

    /**
     * Vote the item with the given uuid by the given amount.
     * Will persist the vote by sending it to the backend.
     *
     * @param {string} uuid The uuid of the ite
     * @param {number} voteValue The amount of the vote, currently -1/+1
     */
    voteItem: function (uuid, voteValue) {

        var item = this.items.get(uuid);

        var votes   = item.get('votes')   || 0;
        var ownVote = item.get('ownVote') || 0;

        // optimistically change the score
        item = item.merge({
            votes: votes - ownVote + voteValue,
            ownVote: voteValue
        });

        // trigger the change
        this.items = this.items.set(uuid, item);
        this.triggerState.bind(this)(this.items);

        // persist the vote in the backend
        api.postVote({
            item: uuid,
            value: voteValue
        });

    },


    /**
     * Favourite/Unfavourite the item with the given uuid
     *
     * @param {string} uuid The uuid of the item
     */
    favouriteItem: function (uuid) {
        var item = this.items.get(uuid);
        var favourite = item.get('favourite');

        var successCallback = () => {
            var itemNew = item.set('favourite', !favourite);
            this.items = this.items.set(item.get('uuid'), itemNew);
            user.profile().then(this.setProfile.bind(this));
        };

        var failCallback = () => {
        };

        var fn = favourite ? 'unfavourite' : 'favourite';

        user[fn](item)
            .then(successCallback)
            .fail(failCallback);

    }

});
