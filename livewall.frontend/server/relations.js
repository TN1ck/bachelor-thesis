var User   = require('./models/User.js');
var Action = require('./models/Action.js');
var Item   = require('./models/Item.js');
var Vote   = require('./models/Vote.js');

// RELATIONS

Vote.belongsTo(User);
Vote.belongsTo(Item);

Action.belongsTo(User);

Item.hasMany(Vote);
Item.hasMany(Action);
