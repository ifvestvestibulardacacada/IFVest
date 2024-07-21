'use strict';

module.exports = {
 up: async (queryInterface, Sequelize) => {
    // Definindo os tópicos relacionados a cada área de estudo para o ENEM
    const topics = {
      Matemática: [
         { materia: 'Álgebra Linear', areaId: 1 },
         { materia: 'Geometria Analítica', areaId: 1 },
         { materia: 'Trigonometria', areaId: 1 },
         { materia: 'Cálculo Diferencial', areaId: 1 },
         { materia: 'Estatística', areaId: 1 }
      ],
      Português: [
         { materia: 'Gramática', areaId: 2 },
         { materia: 'Literatura', areaId: 2 },
         { materia: 'Redação', areaId: 2 },
         { materia: 'Interpretação de Texto', areaId: 2 }
      ],
      História: [
         { materia: 'Idade Antiga', areaId: 3 },
         { materia: 'Idade Média', areaId: 3 },
         { materia: 'Idade Moderna', areaId: 3 },
         { materia: 'Idade Contemporânea', areaId: 3 }
      ],
      Geografia: [
         { materia: 'Geografia Física', areaId: 4 },
         { materia: 'Geografia Humana', areaId: 4 },
         { materia: 'Geopolítica', areaId: 4 },
         { materia: 'Cartografia', areaId: 4 }
      ],
      Ciências: [
         { materia: 'Biologia', areaId: 5 },
         { materia: 'Física', areaId: 5 },
         { materia: 'Química', areaId: 5 },
         { materia: 'Astronomia', areaId: 5 }
      ],
      Artes: [
         { materia: 'Artes Visuais', areaId: 6 },
         { materia: 'Música', areaId: 6 },
         { materia: 'Teatro', areaId: 6 },
         { materia: 'Cinema', areaId: 6 }
      ],
      Informática: [
         { materia: 'Programação', areaId: 7 },
         { materia: 'Redes de Computadores', areaId: 7 },
         { materia: 'Banco de Dados', areaId: 7 },
         { materia: 'Segurança da Informação', areaId: 7 }
      ],
      Química: [
         { materia: 'Química Orgânica', areaId: 8 },
         { materia: 'Química Inorgânica', areaId: 8 },
         { materia: 'Química Analítica', areaId: 8 },
         { materia: 'Físico-Química', areaId: 8 }
      ],
      Física: [
         { materia: 'Mecânica Clássica', areaId: 9 },
         { materia: 'Termodinâmica', areaId: 9 },
         { materia: 'Óptica', areaId: 9 },
         { materia: 'Física Nuclear', areaId: 9 }
      ],
      Biologia: [
         { materia: 'Genética', areaId: 10 },
         { materia: 'Ecologia', areaId: 10 },
         { materia: 'Anatomia Humana', areaId: 10 },
         { materia: 'Evolução', areaId: 10 }
      ],
      Filosofia: [
         { materia: 'Ética', areaId: 11 },
         { materia: 'Lógica', areaId: 11 },
         { materia: 'Filosofia Política', areaId: 11 },
         { materia: 'Metafísica', areaId: 11 }
      ],
      Sociologia: [
         { materia: 'Sociedade e Cultura', areaId: 12 },
         { materia: 'Estratificação Social', areaId: 12 },
         { materia: 'Movimentos Sociais', areaId: 12 },
         { materia: 'Teoria Sociológica', areaId: 12 }
      ],
      'Educação Física': [
         { materia: 'Atividades Físicas', areaId: 13 },
         { materia: 'Fisiologia do Exercício', areaId: 13 },
         { materia: 'Esportes', areaId: 13 },
         { materia: 'Saúde e Bem-Estar', areaId: 13 }
      ],
      'Língua Estrangeira': [
         { materia: 'Gramática', areaId: 14 },
         { materia: 'Vocabulário', areaId: 14 },
         { materia: 'Conversação', areaId: 14 },
         { materia: 'Cultura Estrangeira', areaId: 14 }
      ]
     };
      // Adicione os tópicos para as outras áreas aqui, seguindo o mesmo formato


    // Inserindo os tópicos no banco de dados
    for (const area in topics) {
      for (const materia of topics[area]) {
        await queryInterface.sequelize.query(
          `INSERT INTO "topicos" ("materia", "areaId", "usuarioId", "createdAt", "updatedAt") VALUES ('${materia.materia}', ${materia.areaId}, '${1}', NOW(), NOW())`
        );
      }
    }
 },

 down: async (queryInterface, Sequelize) => {
    // Removendo os tópicos inseridos pelo seed
    await queryInterface.sequelize.query(`DELETE FROM "topicos"`);
 }
};