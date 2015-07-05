var Item = function(sequelize, DataTypes) {
    return sequelize.define('Item', {
        uuid: DataTypes.STRING
    }, {
        freezeTableName: true
    });
};

module.exports = Item;
