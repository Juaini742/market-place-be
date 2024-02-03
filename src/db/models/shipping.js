"use strict";
const {Model} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Shipping extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Shipping.hasMany(models.User, {
        foreignKey: "id",
      });
      Shipping.hasMany(models.Address, {
        foreignKey: "id",
      });
      Shipping.hasMany(models.Checkout_item, {
        foreignKey: "shipping_id",
      });
    }
  }
  Shipping.init(
    {
      user_id: DataTypes.STRING,
      address_id: DataTypes.STRING,
      payment: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Shipping",
    }
  );
  return Shipping;
};
