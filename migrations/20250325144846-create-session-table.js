'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('sessions', {
      sid: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
      },
      sess: { // Nome exato exigido pelo middleware
        type: Sequelize.JSONB,
        allowNull: false
      },
      expire: { // Nome exato exigido pelo middleware
        type: Sequelize.DATE,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Índice para expiração
    await queryInterface.addIndex('sessions', ['expire'], {
      where: { expire: { [Sequelize.Op.gt]: Sequelize.literal('CURRENT_TIMESTAMP') } }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('sessions');
  }
};
