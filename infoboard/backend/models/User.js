/**
 * A user. A user can perform actions, buy boosters, earn badges and downvote/upvote items.
 */

var User = function(sequelize, DataTypes) {
    return sequelize.define('User', {
        username: DataTypes.STRING // the username of the user
    }, {
        freezeTableName: true
    })
};

module.exports = User;
