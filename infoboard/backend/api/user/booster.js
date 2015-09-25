var _       = require('lodash');
var moment  = require('moment');
var models  = require('../../models');
var booster = require('../../../frontend/shared/gamification/booster.js');

var User    = models.User;
var Action  = models.Action;
var Vote    = models.Vote;
var Item    = models.Item;
var Booster = models.Booster;

module.exports = function (req, res) {
    // get params and body
    var username  = req.body.username;
    var boosterId = req.body.booster;
    var body      = req.body;

    // get or create user
    User.findOrCreate({where: {username: username}}).then(function(_user) {

        var user = _user[0];
        var b = _.find(booster, {id: boosterId});

        // TODO: check if the user has enough points

        Booster.create({
            name: b.id,
            validUntil: moment().add(b.duration, 'day').toDate(),
            multiplicator: b.multiplicator,
            points: b.points
        }).then(function(b) {
            b.setUser(user).then(function (b) {
                res.json(b);
            });
        });

    });

};
