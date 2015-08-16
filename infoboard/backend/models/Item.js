/**
 * An item specifies a piece of information with which a user interacted.
 */

var Item = function(sequelize, DataTypes) {
    return sequelize.define('Item', {
        uuid: DataTypes.STRING              // the unique identifier of the item
    }, {
        freezeTableName: true
    });
};

module.exports = Item;
