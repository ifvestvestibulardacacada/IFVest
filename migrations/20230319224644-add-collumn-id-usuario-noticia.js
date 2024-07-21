'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('comentarios',
    'usuarioId',
    {
      type: Sequelize.INTEGER,
      allowNull: false,
      references:{
        model: 'usuarios',
        key: 'id'
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
    
    await queryInterface.removeColumn('comentarios', 
    'usuarioId');
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
