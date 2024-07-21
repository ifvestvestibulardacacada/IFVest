'use strict';

module.exports = {
 up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('questoes_topicos', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      questaoId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'questoes',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      topicoId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'topicos',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      }
    });
 },

 down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('questoes_topicos');
 }
};