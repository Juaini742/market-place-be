"use strict";
const {Model} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User_details extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User_details.belongsTo(models.User, {
        foreignKey: "id",
      });
    }
  }
  User_details.init(
    {
      user_id: DataTypes.STRING,
      refresh_token: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User_details",
    }
  );
  return User_details;
};
