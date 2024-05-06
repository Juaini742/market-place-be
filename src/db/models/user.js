"use strict";
const {Model} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasOne(models.User_details, {
        foreignKey: "user_id",
      });
      User.hasMany(models.Product, {
        foreignKey: "id",
      });
      User.hasOne(models.Cart, {
        foreignKey: "id",
      });
      User.hasOne(models.Address, {
        foreignKey: "user_id",
      });
      User.hasOne(models.Comment, {
        foreignKey: "id",
      });
    }
  }
  User.init(
    {
      avatar: DataTypes.STRING,
      username: DataTypes.STRING,
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      phone: DataTypes.BIGINT,
      store_name: DataTypes.STRING,
      sex: DataTypes.STRING,
      password: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
