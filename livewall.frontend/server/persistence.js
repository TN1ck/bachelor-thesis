var Sequelize = require('sequelize');
var db = require('./settings.js').database;
var sequelize = new Sequelize(db.database, db.username, db.password, db.config);

module.exports = sequelize;
