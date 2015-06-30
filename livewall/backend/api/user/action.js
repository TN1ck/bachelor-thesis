var models = require('../../models');
var _       = require('lodash');

var User = models.User;
var Action = models.Action;
var Vote = models.Vote;
var Item = models.Item;

module.exports = function (req, res) {

    // get params and body
    var body     = req.body;
    var username = body.username;
    var group    = body.group;
    var label    = body.label;
    var value    = JSON.stringify(body.value);

    // get or create user
    var user = User.findOrCreate({
        where: {username: username}
    }).then(function(_user) {

        var user = _user[0];

        var createActionAndAnswer = function (props) {
            return Action.create(actionProps).then(function (action) {
                // action sucessfully created
                res.json(action);
            });
        };

        var actionProps = {
            group: group,
            label: label,
            value: value
        };

        // if the action has an item-uuid ad it to the action props
        if (body.item) {
            promise = Item.findOrCreate({where: {uuid: body.item}}).then(function(_item) {
                var item = _item[0];
                Action.create(actionProps).then(function(action) {
                    action.setItem(item);
                    action.setUser(user);

                    action.save().then(function(action) {
                        res.json(action);
                    });

                });
            });
        } else {
            return Action.create(actionProps).then(function (action) {
                res.json(action);
            });
        }

    });

};
