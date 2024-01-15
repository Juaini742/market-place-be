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

    const sizes = ["Small", "Medium", "Large", "X-Large"];

    const productSizesData = products.flatMap((product) => {
      return sizes.map((size) => ({
        product_id: product.id,
        name: size,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
    });

    await queryInterface.bulkInsert("Product_sizes", productSizesData);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Product_sizes", null, {});
  },
};
