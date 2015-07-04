var Action = function(sequelize, DataTypes) {
    return sequelize.define('Action', {
        group: DataTypes.STRING,
        label: DataTypes.STRING,
        points: DataTypes.INTEGER,
        value: DataTypes.STRING // I will use this a JSON-field, sqlite does not support native json support
    }, {
        freezeTableName: true
    });
};

module.exports = Action;
