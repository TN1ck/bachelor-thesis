var models  = require('../../models');
var moment  = require('moment');
var _       = require('lodash');

var User = models.User;
var Action = models.Action;
var Vote = models.Vote;
var Item = models.Item;
var Badge = models.Badge;
var sequelize = models.sequelize;

module.exports = function (req, res) {

    var limit = req.limit || 20;

    Action.findAll({
        include: [
            {model: User},
            {model: Item}
        ],
        order: [['createdAt', 'DESC']],
        limit: limit
    }).then(function(actions) {
        res.json({
            actions: (actions || []).map(function (action) {
                return {
                    action: action,
                    user: action.User,
                    item: action.Item
                };
            })
        });
    });

};
