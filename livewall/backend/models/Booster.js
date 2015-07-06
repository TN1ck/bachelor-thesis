var Booster = function(sequelize, DataTypes) {
    return sequelize.define('Booster', {
        name: DataTypes.STRING,
        multiplicator: DataTypes.INTEGER,
        validUntil: DataTypes.DATE,
        points: DataTypes.INTEGER,
    }, {
        freezeTableName: true
    });
};

module.exports = Booster;
