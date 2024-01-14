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
      // define association here
    }
  }
  Checkout_item.init(
    {
      product_id: DataTypes.STRING,
      shipping: DataTypes.STRING,
      quantity: DataTypes.INTEGER,
      gross_amount: DataTypes.FLOAT,
      payment_status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Checkout_item",
    }
  );
  return Checkout_item;
};
