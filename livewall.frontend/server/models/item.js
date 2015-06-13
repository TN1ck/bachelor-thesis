var Sequelize = require('sequelize');
var sequelize = require('../persistence.js');

var Action = require('./action.js');
var Vote = require('./vote.js');

var Item = sequelize.define('Item', {
    uuid: Sequelize.STRING,
    last_action_id: Sequelize.INTEGER
}, {
    freezeTableName: true
});

Item.hasMany(Action, {as: 'Actions'});
// Item.hasMany(Vote,   {as: 'Votes'});

module.exports = Item;
