var models = require('../../models');
var _      = require('lodash');

var User = models.User;
var Action = models.Action;
var Vote = models.Vote;
var Item = models.Item;

module.exports = function (req, res) {

    var ids = req.body.items;
    var username = req.body.username;

    User.findOrCreate({
        where: {username: username},
        include: {
            model: Vote
        }
    }).then(function(_user) {
        var user = _user[0].get({plain: true});
        Item.findAll({
            where: { uuid: ids},
            include: [
                {
                    model: Vote,
                    attributes: [
                        [models.sequelize.fn('sum', models.sequelize.col('Votes.value')), 'sum'],
                        [models.sequelize.fn('count', models.sequelize.col('Votes.id')), 'count']
                    ]
                },
                {
                    model: Action,
                    include: [User]
                }
            ],
            order: [
                [Action, 'updatedAt', 'DESC']
            ],
            group: ['Actions.id']
        }).then(function(items) {


            // add user to the results
            items = items.map(function(item) {
                item = item.get({plain: true});
                item.userVote = _.find(user.Votes, {ItemId: item.id}) || {
                    value: 0
                };
                item.votes = item.Votes[0] || {
                    sum: 0,
                    count: 0
                };
                return item;
            });

            res.json({
                items: items
            });
        });
    });

};
