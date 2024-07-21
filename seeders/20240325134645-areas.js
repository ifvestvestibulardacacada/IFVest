'use strict';

module.exports = {
 up: async (queryInterface, Sequelize) => {
    // Definindo as áreas de estudo para o ENEM e suas descrições
    const areas = [
      { area: 'Matemática', descricao: 'Descrição para Matemática' },
      { area: 'Português', descricao: 'Descrição para Português' },
      { area: 'História', descricao: 'Descrição para História' },
      { area: 'Geografia', descricao: 'Descrição para Geografia' },
      { area: 'Ciências', descricao: 'Descrição para Ciências' },
      { area: 'Artes', descricao: 'Descrição para Artes' },
      { area: 'Informática', descricao: 'Descrição para Informática' },
      { area: 'Química', descricao: 'Descrição para Química' },
      { area: 'Física', descricao: 'Descrição para Física' },
      { area: 'Biologia', descricao: 'Descrição para Biologia' },
      { area: 'Filosofia', descricao: 'Descrição para Filosofia' },
      { area: 'Sociologia', descricao: 'Descrição para Sociologia' },
      { area: 'Educação Física', descricao: 'Descrição para Educação Física' },
      { area: 'Língua Estrangeira', descricao: 'Descrição para Língua Estrangeira' }
    ];

    // Inserindo as áreas no banco de dados usando query raw
    for (const area of areas) {
      await queryInterface.sequelize.query(
        `INSERT INTO "areas" ("area", "descricao", "createdAt", "updatedAt") VALUES ('${area.area}', '${area.descricao}', NOW(), NOW())`
      );
    }
 },

 down: async (queryInterface, Sequelize) => {
    // Removendo as áreas inseridas pelo seed
    await queryInterface.sequelize.query(`DELETE FROM "areas"`);
 }
};