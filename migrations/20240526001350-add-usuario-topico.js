'use strict';

module.exports = {
 up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('topicos', 'usuarioId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios', // Nome da tabela referenciada
        key: 'id'
      },

    });
 },

 down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('topicos', 'usuarioId');
 }
};
