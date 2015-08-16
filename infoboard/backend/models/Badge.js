/**
 * A Badge the user earned.
 */

var Badge = function(sequelize, DataTypes) {
    return sequelize.define('Badge', {
        type: {                                  // describes the value of the badge
            type: DataTypes.ENUM,
            values: ['none', 'king', 'emperor']
        },
        name: DataTypes.STRING,                  // the identifier, a user cannot have two badges with the same name
        points: DataTypes.INTEGER                // the amount of points the user earned for the badge
    }, {
        freezeTableName: true
    });
};

module.exports = Badge;
