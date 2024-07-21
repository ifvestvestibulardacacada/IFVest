'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('noticias', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      titulo:{
        type: Sequelize.STRING,
        allowNull: false  
      },
      sub_titulo:{
        type: Sequelize.STRING,
        allowNull: false  
      },
      resumo:{
        type: Sequelize.STRING,
        allowNull: false  
      },
      links:{
        type: Sequelize.STRING,
        allowNull: true
      },
      aprovacao:{
        type: Sequelize.INTEGER,
        allowNull: true  
      },
      createdAt:{
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt:{
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      }
     });
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.createTable('noticias');
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
