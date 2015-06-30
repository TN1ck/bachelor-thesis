var User = function(sequelize, DataTypes) {
    return sequelize.define('User', {
        username: DataTypes.STRING
    }, {
        freezeTableName: true
    })
};

module.exports = User;
