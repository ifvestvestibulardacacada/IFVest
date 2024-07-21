  'use strict';

  /** @type {import('sequelize-cli').Migration} */
  module.exports = {
    async up (queryInterface, Sequelize) {
      await queryInterface.createTable('areas', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false
        },
        area: {
          type: Sequelize.ENUM({
            values: ['Matemática', 'Português', 'História', 'Geografia', 'Ciências', 'Artes', 'Informática', 'Química', 'Física', 'Biologia', 'Filosofia', 'Sociologia', 'Educação Física', 'Língua Estrangeira']
          }),
          allowNull: true,
        },
        descricao: {
          type: Sequelize.STRING,
          allowNull: false
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
      })
      /**
       * Add altering commands here.
       *
       * Example:
       * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
       */
    },

    async down (queryInterface, Sequelize) {
      await queryInterface.dropTable("areas");
      /**
       * Add reverting commands here.
       *
       * Example:
       * await queryInterface.dropTable('users');
       */
    }
  };