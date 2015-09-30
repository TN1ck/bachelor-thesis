var moment = require('moment');
var _       = require('lodash');

var calculatePoints = require('./calculatePoints.js');

module.exports = function (req, res) {
    return calculatePoints(
        req.query.from
    ).then(function(result) {
        res.json(result);
    });
};
