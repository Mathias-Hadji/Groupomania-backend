'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      first_name_user: {
        allowNull: false,
        type: Sequelize.STRING
      },
      last_name_user: {
        allowNull: false,
        type: Sequelize.STRING
      },
      email_user: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true
      },
      password_user: {
        allowNull: false,
        type: Sequelize.STRING
      },
      profile_pic_user: {
        allowNull: false,
        type: Sequelize.STRING
      },
      bio_user: {
        allowNull: true,
        type: Sequelize.STRING,
        defaultValue: 'Aucune description',
      },
      is_admin: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: 0,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
  }
};