'use strict';

const { Questões, Opcao } = require('../models');

const questoesMatematicaEnem = [
  {
    pergunta: '{"ops":[{"insert":"Qual é o valor de x na equação 2x + 5 = 15?"}]}',
    titulo: 'Cálculo de x', // Substitua pelo ID do tópico apropriado
    usuarioId: 1,
    areaId: 1,
    resposta:"", // Substitua pelo ID do usuário apropriado
    tipo: 'OBJETIVA',
    opcoes: [
      { descricao: '5', correta: true },
      { descricao: '10', correta: false },
      { descricao: '15', correta: false },
      { descricao: '20', correta: false },
    ],
  },
  {
    pergunta: '{"ops":[{"insert":"Qual é a área de um triângulo com base de 6 metros e altura de 8 metros?"}]}',
    titulo: 'Área de triângulo', // Substitua pelo ID do tópico apropriado
    usuarioId: 1,
    areaId: 1,
    resposta:"", // Substitua pelo ID do usuário apropriado
    tipo: 'OBJETIVA',
    opcoes: [
      { descricao: '12 m²', correta: false },
      { descricao: '24 m²', correta: true },
      { descricao: '30 m²', correta: false },
      { descricao: '48 m²', correta: false },
    ],
  },
  {
    pergunta: '{"ops":[{"insert":"Se um produto custa R$ 120 e seu preço sobe 20%, qual será o novo preço?"}]}',
    titulo: 'Aumento de preço', // Substitua pelo ID do tópico apropriado
    usuarioId: 1, 
    areaId: 1,
    resposta:"",// Substitua pelo ID do usuário apropriado
    tipo: 'OBJETIVA',
    opcoes: [
      { descricao: 'R$ 132', correta: true },
      { descricao: 'R$ 144', correta: false },
      { descricao: 'R$ 110', correta: false },
      { descricao: 'R$ 96', correta: false },
    ],
  },
  {
    pergunta:'{"ops":[{"insert":"Qual é a solução da equação 3x² - 12x + 9 = 0?"}]}' ,
    titulo: 'Equação quadrática', // Substitua pelo ID do tópico apropriado
    usuarioId: 1,
    areaId: 1,
    resposta:"", // Substitua pelo ID do usuário apropriado
    tipo: 'OBJETIVA',
    opcoes: [
      { descricao: 'x = 3', correta: false },
      { descricao: 'x = 2', correta: false },
      { descricao: 'x = 1', correta: true },
      { descricao: 'x = 0', correta: false },
    ],
  },
  {
    pergunta: '{"ops":[{"insert":"Qual é a soma dos ângulos internos de um hexágono?"}]}',
    titulo: 'Soma dos ângulos internos', // Substitua pelo ID do tópico apropriado
    usuarioId: 1,
    areaId: 1,
    resposta:"", // Substitua pelo ID do usuário apropriado
    tipo: 'OBJETIVA',
    opcoes: [
      { descricao: '360°', correta: false },
      { descricao: '540°', correta: true },
      { descricao: '720°', correta: false },
      { descricao: '900°', correta: false },
    ],
  },
  {
    pergunta: '{"ops":[{"insert":"Se um número é aumentado em 25% e o resultado é 50, qual é o número original?"}]}',
    titulo: 'Número aumentado', // Substitua pelo ID do tópico apropriado
    usuarioId: 1, 
    areaId: 1,
    resposta:"",// Substitua pelo ID do usuário apropriado
    tipo: 'OBJETIVA',
    opcoes: [
      { descricao: '40', correta: false },
      { descricao: '45', correta: false },
      { descricao: '50', correta: true },
      { descricao: '55', correta: false },
    ],
  },
  
]

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      for (const questao of questoesMatematicaEnem) {
        const questaoCriada = await Questões.create(questao);
        for (const opcao of questao.opcoes) {
          await Opcao.create({ ...opcao, questao_id: questaoCriada.id });
        }
        await questaoCriada.addTopico(1);
      }
      console.log('Seed executada com sucesso!');
    } catch (error) {
      console.error('Erro ao executar a seed:', error);
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await Opcao.destroy({ where: {} });
      await Questões.destroy({ where: {} });
      console.log('Seed revertida com sucesso!');
    } catch (error) {
      console.error('Erro ao reverter a seed:', error);
    }
  },
};
