var _      = require('lodash');
var models = require('../models');
var POINTS = require('../../frontend/shared/gamification/points');
var BADGES = require('../../frontend/shared/gamification/badges');

var User = models.User;
var Action = models.Action;
var Vote = models.Vote;
var Item = models.Item;
var Badge = models.Badge;
var sequelize = models.sequelize;
