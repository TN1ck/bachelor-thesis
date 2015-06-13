//
// DROP ALL TABLES AND CREATE THEM FROM SCRATCH
//
var sequelize = require('./persistence.js');

var User   = require('./models/User.js');
var Action = require('./models/Action.js');
var Item   = require('./models/Item.js');
var Vote   = require('./models/Vote.js');

// RELATIONS

Vote.belongsTo(User);
Vote.belongsTo(Item);

Action.belongsTo(User);
Action.belongsTo(Item);

Item.hasMany(Vote);
Item.hasMany(Action);

User.hasMany(Vote);
User.hasMany(Action);

// ATTENTION!
sequelize.sync({force: true});
