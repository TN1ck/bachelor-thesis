var Sequelize = require('sequelize');
var db = require('../config/database.js');

// connect to the dabatase
var sequelize = new Sequelize(db.database, db.username, db.password, db.config);

// used models in this application
var models = [
    'User',
    'Item',
    'Action',
    'Vote',
    'Badge',
    'Booster'
];

// import each model
models.forEach(function(model) {
    module.exports[model] = sequelize.import(__dirname + '/' + model);
});

// CREATE THE RELATIONSHIP

(function(m) {

    // a vote is performed by a user
    m.Vote.belongsTo(m.User);
    // a vote is performed on an item
    m.Vote.belongsTo(m.Item);

    // an action is performed by a user
    m.Action.belongsTo(m.User);
    // an action *can* be performed on an item
    m.Action.belongsTo(m.Item);

    // an item as many votes
    m.Item.hasMany(m.Vote);
    // ... and many actions
    m.Item.hasMany(m.Action);

    // badges are earned by users
    m.Badge.belongsTo(m.User);

    // boosters are bought by the user
    m.Booster.belongsTo(m.User);

    // a user performs many votes
    m.User.hasMany(m.Vote);
    // a user performs many actions
    m.User.hasMany(m.Action);
    // a user earns many badges
    m.User.hasMany(m.Badge);
m.User.hasMany(m.Booster);

})(module.exports);

module.exports.sequelize = sequelize;
