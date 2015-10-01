var activities = require('./currentActivities.js');
var hideUsers  = require('../../config/gamification.js').hideUsers;
var io         = require('../socket.js');

module.exports = function (action) {

    // do not process activities from blocked users
    if (hideUsers.indexOf(action.user.username) > -1) {
        return;
    }

    var newActivities = [];

    newActivities.unshift({
        data: action.action,
        type: 'action',
        username: action.user.username,
        createdAt: action.action.createdAt,
        points: action.action.points
    });

    action.badges.forEach(function (b) {
        newActivities.unshift({
            data: b,
            type: 'badge',
            username: action.user.username,
            createdAt: action.action.createdAt,
            points: b.points
        });
    });

    newActivities.forEach(function (activity) {
        activities.unshift(activity);
        io.emit('activity_created', activity);
    });

    activities.splice(100, activities.length);

};
