var Sequelize = require('sequelize');
var sequelize = require('../persistence.js');

var Vote = sequelize.define('Vote', {
    value: Sequelize.INTEGER,
    date: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
}, {
    freezeTableName: true
});

module.exports = Vote;
