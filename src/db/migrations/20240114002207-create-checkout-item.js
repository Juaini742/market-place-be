"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Checkout_items", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
        defaultValue: crypto.randomUUID(),
      },
      product_id: {
        type: Sequelize.STRING,
        references: {
          model: "Products",
          key: "id",
        },
      },
      shipping_id: {
        type: Sequelize.STRING,
        references: {
          model: "Shippings",
          key: "id",
        },
      },
      quantity: {
        type: Sequelize.INTEGER,
      },
      color: {
        type: Sequelize.STRING,
      },
      size: {
        type: Sequelize.STRING,
      },
      payment_status: {
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
    await queryInterface.dropTable("Checkout_items");
  },
};
