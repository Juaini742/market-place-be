"use strict";
const {Model} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Checkout_item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Checkout_item.belongsTo(models.Product, {
        foreignKey: "id",
      });
      Checkout_item.belongsTo(models.Shipping, {
        foreignKey: "id",
      });
    }
  }
  Checkout_item.init(
    {
      product_id: DataTypes.STRING,
      shipping_id: DataTypes.STRING,
      quantity: DataTypes.INTEGER,
      color: DataTypes.STRING,
      size: DataTypes.STRING,
      payment_status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Checkout_item",
    }
  );
  return Checkout_item;
};
