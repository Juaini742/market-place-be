"use strict";

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
    const dataUsers = [
      {
        id: "04aada87-26cc-40d0-81f9-40ae34bc81dc",
        avatar: null,
        username: "user1",
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "123456789",
        store_name: "Doe's Store",
        sex: "male",
        password: "password1",
      },
      {
        id: "79846596-af08-409b-97a9-daded7a4da29",
        avatar: null,
        username: "user2",
        name: "Jane Doe",
        email: "jane.doe@example.com",
        phone: "987654321",
        store_name: "Jane's Shop",
        sex: "female",
        password: "password2",
      },
      {
        id: "79846596-af08-409b-97a9-daded7a4da30",
        avatar: null,
        username: "user3",
        name: "Bob Smith",
        email: "bob.smith@example.com",
        phone: "555555555",
        store_name: "Bob's Emporium",
        sex: "male",
        password: "password3",
      },
    ];

    const seederData = dataUsers.map((item) => ({
      id: item.id,
      avatar: item.avatar,
      username: item.username,
      name: item.name,
      email: item.email,
      phone: item.phone,
      store_name: item.store_name,
      sex: item.sex,
      password: item.password,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await queryInterface.bulkInsert("Users", seederData);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Users", null, {});
  },
};
