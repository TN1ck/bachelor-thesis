var Badge = function(sequelize, DataTypes) {
    return sequelize.define('Badge', {
        type: {
            type: DataTypes.ENUM,
            values: ['none', 'king', 'emperor']
        },
        name: DataTypes.STRING,
        points: DataTypes.INTEGER
    }, {
        freezeTableName: true
    });
};

module.exports = Badge;
