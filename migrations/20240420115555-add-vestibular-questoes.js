'use strict';

module.exports = {
 up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('questoes', 'vestibularId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'vestibular', // Nome da tabela referenciada
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
 },

 down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('questoes', 'vestibularId');
 }
};
