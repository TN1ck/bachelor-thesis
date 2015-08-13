/**
 * A vote performed by a user on an item.
 */

var Vote = function(sequelize, DataTypes) {
    return sequelize.define('Vote', {
        value: DataTypes.INTEGER // the value of the vote, typically its +1/-1
    }, {
        freezeTableName: true
    });
};

module.exports = Vote;
