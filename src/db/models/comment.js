"use strict";
const {Model} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Comment.belongsTo(models.User, {
        foreignKey: "id",
      });
      Comment.belongsTo(models.Product, {
        foreignKey: "id",
      });
    }
  }
  Comment.init(
    {
      user_id: DataTypes.STRING,
      rating: DataTypes.STRING,
      message: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Comment",
    }
  );
  return Comment;
};
