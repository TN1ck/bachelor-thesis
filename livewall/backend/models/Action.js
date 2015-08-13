/**
 * The Action model describes an action performed by the user such as an authentication
 * or an upvote.
 */

var Action = function(sequelize, DataTypes) {
    return sequelize.define('Action', {
        group: DataTypes.STRING,   // group of the action, like 'vote'
        label: DataTypes.STRING,   // specific label of the action like 'up' / 'down'
        points: DataTypes.INTEGER, // the amount of points the user got for the action
        value: DataTypes.STRING    // I will use this a JSON-field, sqlite does not support native json support
    }, {
        freezeTableName: true
    });
};

module.exports = Action;
