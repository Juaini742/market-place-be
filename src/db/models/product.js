"use strict";
const {Model} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Product.belongsTo(models.User, {
        foreignKey: "id",
      });
      Product.hasMany(models.Product_size, {
        foreignKey: "product_id",
      });
      Product.hasMany(models.Product_color, {
        foreignKey: "product_id",
      });
      Product.hasOne(models.Cart, {
        foreignKey: "product_id",
      });
    }
  }
  Product.init(
    {
      user_id: DataTypes.STRING,
      product_name: DataTypes.STRING,
      stock: DataTypes.INTEGER,
      category: DataTypes.STRING,
      sold: DataTypes.INTEGER,
      price: DataTypes.DECIMAL,
      short_description: DataTypes.STRING,
      long_description: DataTypes.TEXT,
      img: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Product",
    }
  );
  return Product;
};
