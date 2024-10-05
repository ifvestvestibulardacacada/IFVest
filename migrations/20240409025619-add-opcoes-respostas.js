module.exports = {
  up: async (queryInterface, Sequelize) => {
     await queryInterface.addColumn('resposta', 'opcaoId', {
       type: Sequelize.INTEGER,
       allowNull: true, // Torna o campo opcional
       references: {
         model: 'opcoes', // Certifique-se de que o nome do modelo esteja correto
         key: 'id',
       },
       onUpdate: 'CASCADE',
       onDelete: 'CASCADE',
     });
  },
 
  down: async (queryInterface, Sequelize) => {
     await queryInterface.removeColumn('resposta', 'opcaoId');
  }
 };
