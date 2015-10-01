var models     = require('../../models');
var moment     = require('moment');
var _          = require('lodash');
var activities = require('./currentActivities.js');

module.exports = function (req, res) {

    var limit = req.limit || 20;

    return res.json(
        {
            activities: activities.slice(0, limit)
        }
    );

};
