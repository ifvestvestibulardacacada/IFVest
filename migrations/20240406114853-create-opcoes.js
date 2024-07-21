"use strict";

module.exports = {
 up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('opcoes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      questao_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'questoes',
          },
          key: 'id'
        }
      },
      descricao: {
        type: Sequelize.STRING,
        allowNull: false
      },
      correta: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
    });
 },

 down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('opcoes');
 }
};
