//
// DROP ALL TABLES AND CREATE THEM FROM SCRATCH
//
var sequelize = require('../models').sequelize;

// ATTENTION!
sequelize.sync({force: true});
