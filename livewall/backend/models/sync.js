//
// DROP ALL TABLES AND CREATE THEM FROM SCRATCH
//
var sequelize = require('./index.js').sequelize;

// ATTENTION!
sequelize.sync({force: true});
