var Sequelize = require('sequelize');
var sequelize = require('../persistence.js');

var Action = sequelize.define('Action', {
    group: Sequelize.STRING,
    label: Sequelize.STRING,
    value: Sequelize.STRING, // I will use this a JSON-field, sqlite does not support native json support
    date: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
}, {
    freezeTableName: true
});

module.exports = Action;
