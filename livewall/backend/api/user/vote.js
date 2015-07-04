var _       = require('lodash');
var models = require('../../models');

var User = models.User;
var Action = models.Action;
var Vote = models.Vote;
var Item = models.Item;

module.exports = function (req, res) {
    // get params and body
    var username = req.body.username;
    var item     = req.body.item;
    var body     = req.body;

    console.log(username, item);

    // get or create user
    User.findOrCreate({where: {username: username}}).then(function(_user) {
        var user = _user[0];


        // get or create item
        Item.findOrCreate({where: {uuid: item}}).then(function(_item) {
            var item = _item[0];

            Vote.findOrCreate({where: {
                UserId: user.id,
                ItemId: item.id
            }}).then(function(vote) {

                // update vote with new value
                var _vote = vote[0];
                _vote.value = _.parseInt(body.value);
                _vote.setUser(user);
                _vote.setItem(item);

                _vote.save().then(function(vote) {
                    res.json(vote);
                });
            });

        });

    });

};
