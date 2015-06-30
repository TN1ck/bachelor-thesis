var Vote = function(sequelize, DataTypes) {
    return sequelize.define('Vote', {
        value: DataTypes.INTEGER
    }, {
        freezeTableName: true
    });
};

module.exports = Vote;
