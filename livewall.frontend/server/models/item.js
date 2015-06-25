var Sequelize = require('sequelize');
var sequelize = require('../persistence.js');

var Item = sequelize.define('Item', {
    uuid: Sequelize.STRING,
}, {
    freezeTableName: true
});

module.exports = Item;
