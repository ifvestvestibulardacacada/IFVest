'use strict';

module.exports = {
 up: async (queryInterface, Sequelize) => {
    // Definindo os tipos de simulados e suas descrições
    const simulados = [
      { tipo: 'DISSERTATIVO', titulo: 'Simulado Dissertativo', descricao: 'Descrição para o simulado dissertativo.' },
      { tipo: 'OBJETIVO', titulo: 'Simulado Objetivo', descricao: 'Descrição para o simulado objetivo.' },
      { tipo: 'ALEATORIO', titulo: 'Simulado Aleatório', descricao: 'Descrição para o simulado aleatório.' }
    ];
    // Definindo os IDs das áreas

    // Definindo o usuário ID
    const usuarioId = 1;

    // Loop para inserir um simulado de cada tipo para cada área
    for (const simulado of simulados) {
  
        await queryInterface.sequelize.query(
          `INSERT INTO "simulados" ("titulo", "descricao", "tipo", "usuarioId",  "createdAt", "updatedAt") VALUES ('${simulado.titulo}', '${simulado.descricao}', '${simulado.tipo}', ${usuarioId}, NOW(), NOW())`
        );
      
    }
 },

 down: async (queryInterface, Sequelize) => {
    // Removendo os simulados inseridos pelo seed
    await queryInterface.sequelize.query(`DELETE FROM "simulados"`);
 }
};