import _          from 'lodash';
import Reflux     from 'reflux';
import Immutable  from 'immutable';
import $          from 'jquery';
import moment     from 'moment';

import actions    from '../actions/actions.js';
import {user}     from '../auth.js';
import SETTINGS   from '../settings.js';

import {
    postVote,
    getItems
}                 from '../api/api.js';

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

        this.listenTo(actions.addItems,      this.addItems);
        this.listenTo(actions.voteItem,      this.voteItem);
        this.listenTo(actions.favouriteItem, this.favouriteItem);
        this.listenTo(actions.removeQuery,   this.removeQuery);



        user.whenProfileIsLoaded(this.setProfile.bind(this));

    },

    matchUpvotes: function () {
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

    setProfile: function (profile) {
        this.profile.queries = profile.queries;
        this.profile.favourites = profile.favourites;
        this.triggerState();
    },

    filterItem: function (item) {
        return _.some(SETTINGS.FILTER, (v, k) => {
            return _.some(v, (filter) => {
                var contentToBeFiltered = JSON.stringify(item.get(k)) || item.get(k) || '';
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


        var tempItems = {};

        items.forEach(item => {
            if (this.filterItem(item)) {
                // console.log('filtered item ', item.toJS());
                return;
            }

            tempItems[item.get('uuid')] = item;
        });

        var uuids = _.keys(tempItems).join(',');

        //
        // get upvotes and actions of the tiles
        //

        getItems(uuids).then(result => {

            result.items.forEach(item => {
                var _item = tempItems[item.uuid];
                if (_item) {

                    var votes = item.votes;

                    var ownVote = item.userVote;

                    tempItems[item.uuid] = _item.merge({
                        votes: votes.sum,
                        ownVote: ownVote.value,
                        // for the moment we only query one action
                        actions: item.Actions
                    });
                }
                return;
            });

            this.items = this.items.merge(tempItems);

            this.triggerState();
        });


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

    voteItem: function (uuid, voteValue) {

        // optimistically change the score

        var item = this.items.get(uuid);

        var votes   = item.get('votes')   || 0;
        var ownVote = item.get('ownVote') || 0;

        item = item.merge({
            votes: votes - ownVote + voteValue,
            ownVote: voteValue
        });


        this.items = this.items.set(uuid, item);
        this.triggerState.bind(this)(this.items);

        // make the real request

        postVote({
            item: uuid,
            value: voteValue
        });

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
