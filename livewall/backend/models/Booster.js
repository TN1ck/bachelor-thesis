/**
 * A Booster the user bought. It will multplicate the points of every action the user performs
 * by the specified multiplicator.
 */

var Booster = function(sequelize, DataTypes) {
    return sequelize.define('Booster', {
        name: DataTypes.STRING,             // the name of the booster
        multiplicator: DataTypes.INTEGER,   // with which multiplicator the points of each performed action are multiplicated
        validUntil: DataTypes.DATE,         // the date until the multiplactor will be used
        points: DataTypes.INTEGER,          // how many points it cost the user to buy the booster
    }, {
        freezeTableName: true
    });
};

module.exports = Booster;
