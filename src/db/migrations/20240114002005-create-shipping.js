"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Shippings", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
        defaultValue: crypto.randomUUID(),
      },
      user_id: {
        type: Sequelize.STRING,
        references: {
          model: "Users",
          key: "id",
        },
      },
      address_id: {
        type: Sequelize.STRING,
        references: {
          model: "Addresses",
          key: "id",
        },
      },
      payment: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Shippings");
  },
};
