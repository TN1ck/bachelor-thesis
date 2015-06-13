var Sequelize = require('sequelize');
var sequelize = require('../persistence.js');

var User = sequelize.define('User', {
    username: Sequelize.STRING
}, {
    freezeTableName: true
});

module.exports = User;
