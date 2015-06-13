var express = require('express');
var bodyParser = require('body-parser');
var Promise = require('bluebird');
var cors    = require('cors');
var http    = require('http');
var _       = require('lodash');

var User   = require('./models/user.js');
var Item   = require('./models/item.js');
var Action = require('./models/action.js');
var Vote   = require('./models/vote.js');

Vote.belongsTo(User);
Vote.belongsTo(Item);

Action.belongsTo(User);
Action.belongsTo(Item);

Item.hasMany(Vote);
Item.hasMany(Action);

User.hasMany(Vote);
User.hasMany(Action);

var app     = express();
var port    = 4000;


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//
// ROUTES
//

var router = express.Router();

router.post('/user/:username/action', cors(), function (req, res) {

    // get params and body
    var username = req.params.username;
    var body = req.body;

    // get or create user
    var user = User.findOrCreate({
        where: {username: username}
    }).then(function(_user) {

        var group = body.group;
        var label = body.label;
        var value = JSON.stringify(body.value);

        // create action
        var action = Action.create({
            group: group,
            label: label,
            value: value,
            user_id: _user.id,
        }).then(function (action) {
            // action sucessfully created
            res.json(action);
        });

    });

});

router.post('/user/vote', cors(), function (req, res) {
    // get params and body
    var username = req.body.user;
    var item     = req.body.item;
    var body     = req.body;

    console.log(body, username, item);

    // get or create user
    User.findOrCreate({where: {username: username}}).then(function(_user) {
        var user = _user[0];


        // get or create item
        Item.findOrCreate({where: {uuid: item}}).then(function(_item) {
            var item = _item[0];

            console.log(user, item, user.id);

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

});

router.get('/items', cors(), function (req, res) {
    var ids = req.query.items.split(',');
    console.log(ids);
    Item.findAll({
        where: { uuid: ids},
        include: [ {
            model: Vote,
            include: [User]
        }, {
            model: Action,
            include: [User]
        } ]
    }).then(function(result) {
        var rows = result.map(function(d) {
            return d.dataValues;
        });

        // aggregate votes
        var rows = rows.map(function(row) {
            row.votes = _.sum(row.Votes, function (vote) {
                return vote.value;
            });
            return row;
        });

        res.json({
            items: rows
        });
    });
});

router.get('/items')

router.get('/items/votes/');

app.use('/api', router);

app.listen(port);
