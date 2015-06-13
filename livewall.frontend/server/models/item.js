var Sequelize = require('sequelize');
var sequelize = require('../persistence.js');

var Item = sequelize.define('Item', {
    uuid: Sequelize.STRING,
    last_action_id: Sequelize.INTEGER
}, {
    freezeTableName: true
});

module.exports = Item;
