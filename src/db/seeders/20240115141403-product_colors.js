"use strict";
const {Product} = require("../models");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    const products = await Product.findAll();

    const colors = ["Black", "White", "Blue", "Orange & White"];

    const productColorsData = products.flatMap((product) => {
      return colors.map((color) => ({
        product_id: product.id,
        name: color,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
    });
    await queryInterface.bulkInsert("Product_colors", productColorsData);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Product_colors", null, {});
  },
};
