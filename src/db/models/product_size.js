"use strict";
const {Model} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product_size extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Product_size.belongsTo(models.Product, {
        foreignKey: "id",
      });
    }
  }
  Product_size.init(
    {
      name: DataTypes.STRING,
      product_id: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Product_size",
    }
  );
  return Product_size;
};
