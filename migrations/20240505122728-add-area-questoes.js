'use strict';

module.exports = {
 up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('questoes', 'areaId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'areas', // Nome da tabela referenciada
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
 },

 down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('questoes', 'areaId');
 }
};
