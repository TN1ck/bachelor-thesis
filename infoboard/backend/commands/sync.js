/**
 * DROP ALL TABLES ARE CRATE THEM AGAIN
 */
var sequelize = require('../models').sequelize;
 
sequelize.sync({force: true});
