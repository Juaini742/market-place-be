"use strict";
const {Model} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Cart.belongsTo(models.User, {
        foreignKey: "id",
      });
      Cart.hasMany(models.Product, {
        foreignKey: "id",
      });
    }
  }
  Cart.init(
    {
      user_id: DataTypes.STRING,
      product_id: DataTypes.STRING,
      quantity: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Cart",
    }
  );
  return Cart;
};
