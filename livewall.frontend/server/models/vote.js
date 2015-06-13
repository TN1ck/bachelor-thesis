var Sequelize = require('sequelize');
var sequelize = require('../persistence.js');

var Vote = sequelize.define('Vote', {
    value: Sequelize.INTEGER
}, {
    freezeTableName: true
});

module.exports = Vote;
