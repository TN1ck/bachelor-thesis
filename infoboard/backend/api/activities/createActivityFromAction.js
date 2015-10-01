var activities = require('./currentActivities.js');
var io         = require('../socket.js');

module.exports = function (action) {

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

};
