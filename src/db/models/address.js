"use strict";
const {Model} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Address extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Address.belongsTo(models.User, {
        foreignKey: "id",
      });
    }
  }
  Address.init(
    {
      user_id: DataTypes.STRING,
      city: DataTypes.STRING,
      postal_code: DataTypes.STRING,
      privince: DataTypes.STRING,
      country: DataTypes.STRING,
      address: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Address",
    }
  );
  return Address;
};
