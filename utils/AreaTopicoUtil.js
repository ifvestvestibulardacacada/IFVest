const { Topico } = require('../models');
const { Questões } = require('../models');


async function atualizarRelacaoTopicos(idQuestao, topicosSelecionados, areaId) {
  try {
    const questao = await Questões.findByPk(idQuestao, {
      include: [{
        model: Topico,
        as: 'Topicos',
        attributes: ['id']
      }]
    });

    // Verificar se a questão foi encontrada
    if (!questao) {
      throw new Error('Questão não encontrada');
    }

    const topicosIdsAtuais = questao.Topicos.map(topico => topico.id);

    // Remover tópicos que não estão mais selecionados
    await questao.removeTopicos(topicosIdsAtuais);

    // Adicionar novos tópicos selecionados
    if (areaId && areaId !== questao.areaId) {
      // Atualizar a área da questão
      await Questões.update({
        areaId: areaId,
      }, {
        where: { id: idQuestao }
      });
    }

    await questao.addTopicos(topicosSelecionados);
  } catch (error) {
    console.error('Erro ao atualizar relação de tópicos:', error);
    throw error;
  }
}

  module.exports = {
    atualizarRelacaoTopicos
  };