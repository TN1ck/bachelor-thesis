var Sequelize = require('sequelize');
var db = require('../config/database.js');
var sequelize = new Sequelize(db.database, db.username, db.password, db.config);

var models = [
  'User',
  'Item',
  'Action',
  'Vote'
];

models.forEach(function(model) {
  module.exports[model] = sequelize.import(__dirname + '/' + model);
});

(function(m) {

  m.Vote.belongsTo(m.User);
  m.Vote.belongsTo(m.Item);

  m.Action.belongsTo(m.User);
  m.Action.belongsTo(m.Item);

  m.Item.hasMany(m.Vote);
  m.Item.hasMany(m.Action);

  m.User.hasMany(m.Vote);
  m.User.hasMany(m.Action);

})(module.exports);

module.exports.sequelize = sequelize;
