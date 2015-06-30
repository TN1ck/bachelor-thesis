var models = require('../../models');
var _      = require('lodash');

var User = models.User;
var Action = models.Action;
var Vote = models.Vote;
var Item = models.Item;

module.exports = function (req, res) {
    var ids = req.query.items.split(',');
    Item.findAll({
        where: { uuid: ids},
        include: [
            {
                model: Vote,
                include: [User]
            },
            {
                model: Action,
                include: [User]
            }
        ],
        order: [
            [Action, 'updatedAt', 'DESC']
        ]
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
};
