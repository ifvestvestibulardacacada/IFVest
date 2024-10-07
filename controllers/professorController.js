const { Router } = require('express');
const { Topico } = require('../models');
const { Opcao } = require('../models');
const { Simulados } = require('../models');
const { Questões } = require('../models');
const { Vestibular } = require('../models');
const { Area } = require('../models');

const { Op, NUMBER } = require('sequelize');
const roteador = Router()
const { atualizarRelacaoTopicos } = require('../utils/AreaTopicoUtil')
const { removeFileFromUploads } = require('../utils/removeImage')



roteador.get('/registrar-questao/:tipo', async (req, res) => {
  try {
    if (!req.session.login) {
      return res.status(401).redirect('/usuario/login');
    }

    const tipo = req.params.tipo.toLowerCase();
    const usuarioId = req.session.idUsuario;
    //req.session.tipoQuestao = tipo; // Armazena o tipo de questão na sessão

    const Areas = await Area.findAll({
      include: [{
        model: Topico,
        as: 'Topico' // Ajuste conforme necessário, dependendo de como você configurou a associação
      }]
    })


    // Mapeamento dos tipos de questões aos tipos de simulados
    const tipoSimuladoMap = {
      "objetiva": ['ALEATORIO', 'OBJETIVO'],
      "dissertativa": ['DISSERTATIVO', 'ALEATORIO']
    };

    // Verifica se o tipo de questão é válido
    if (!tipoSimuladoMap[tipo]) {
      return res.status(400).send('Tipo de questão inválido');
    }

    // Consulta todos os simulados do usuário, filtrando por tipo
    const simulados = await Simulados.findAll({
      where: {
        usuarioId: usuarioId,
        tipo: {
          [Op.in]: tipoSimuladoMap[tipo]
        }
      }
    });
    let errorMessage = req.session.errorMessage;

    if (errorMessage === null) {
      errorMessage = " ";
    }

    req.session.errorMessage = null;

    // Retorna os simulados filtrados
    res.status(200).render('professor/criar-questao', { Areas, tipo, simulados, errorMessage });
  } catch (error) {
    console.error(err)

    res.status(500).redirect('/usuario/inicioLogado');
  }
});

roteador.post('/registrar-questao/:tipo', async (req, res) => {
  try {
    const { pergunta, titulo, resposta, areaId, respostas, correta, topicosSelecionados, } = req.body;



    const tipo = req.params.tipo.toUpperCase();
    const usuarioId = req.session.idUsuario;
    if (!pergunta) {
      throw new Error("Pergunta não pode ser vazio")
    }
    if (!topicosSelecionados) {
      throw new Error("Selecione pelo menos um tópico")
    }

    // Aqui, você pode criar a questão usando newVestibularId
    const questao = await Questões.create({
      pergunta,
      titulo,
      areaId,
      usuarioId,
      resposta,
      tipo, // Usa o novo ID do vestibular
    });


    await questao.addTopicos(topicosSelecionados)

    if (tipo === 'OBJETIVA') {
      // Supondo que 'correta' seja o índice da resposta correta, inicializado antes do loop
      let corretaIndex = parseInt(correta, 10); // Converte 'correta' para um número

      // Adiciona as opções apenas se o tipo do simulado for "objetivo"
      for (let i = 0; i < respostas.length; i++) {
        const opcao = respostas[i];
        // Compara o índice atual com o índice da resposta correta
        let isCorreta = i + 1 === corretaIndex;

        await Opcao.create({
          questao_id: questao.id,
          descricao: opcao, // Supondo que cada opção tenha uma propriedade 'descricao'
          correta: isCorreta // Marca como true se a opção atual é a correta
        });
      }
    }

    res.status(201).redirect('/usuario/inicioLogado');
  } catch (err) {
    console.error(err);
    req.session.errorMessage = err.message;
    res.redirect('back')
  }
});

// Renderiza a pagina de Verificar-similaridade


roteador.get('/manutencao', async (req, res) => {

  res.status(200).render('professor/manutencao');
});


// Rota que renderiza a página 'minhas-questoes'
roteador.get('/questoes', async (req, res) => {
  const usuarioId = req.session.idUsuario;
  const { titulo, areaId, topicosSelecionados, questaoId, pergunta } = req.query; // Adiciona 'pergunta' aos parâmetros recuperados
  const limit = 10; // Número de questões por página
  const page = parseInt(req.query.page) || 1; // Página atual, padrão é 1
  const offset = (page - 1) * limit;

  try {
    let questoes;
    if (questaoId) {
      // Se questaoId estiver presente, busca apenas a questão específica
      questoes = await Questões.findOne({
        where: {
          usuarioId: usuarioId,
          id: questaoId,
        },
        include: [{
          model: Area,
          as: 'Area'
        }, {
          model: Topico,
          as: 'Topicos'
        }],
      });
    } else {
      // Se não, busca todas as questões como antes
      questoes = await Questões.findAll({
        where: {
          usuarioId: usuarioId,
        },
        include: [{
          model: Area,
          as: 'Area'
        }, {
          model: Topico,
          as: 'Topicos'
        }],
        limit: limit,
        offset: offset,
      });
    }

    const questoesCount = await Questões.count({
      where: {
        usuarioId: usuarioId,
      },
    });

    const totalPages = Math.ceil(questoesCount / limit);

    // Buscar todas as áreas para o filtro
    const topicos = await Topico.findAll();
    const Areas = await Area.findAll({
      include: [{
        model: Topico,
        as: 'Topico' // Ajuste conforme necessário, dependendo de como você configurou a associação
      }]
    });

    // Filtrar questões usando JavaScript
    let questoesFiltradas = questoes; // Use 'questoes' em vez de 'questoesDisponiveis'
    if (titulo) {
      questoesFiltradas = questoes.filter(questao => questao.titulo.toLowerCase().includes(titulo.toLowerCase()));
    }
    if (areaId && areaId !== "") {
      questoesFiltradas = questoes.filter(questao => questao.areaId === Number(areaId));
    }
    if (topicosSelecionados && topicosSelecionados !== "") {
      // Conversão de topicosSelecionados para Array de IDs
      const topicosIds = Array.isArray(topicosSelecionados) ? topicosSelecionados : topicosSelecionados.split(',').map(id => parseInt(id));
      questoesFiltradas = questoes.filter(questao => {
        // Garante que questao.topicos seja um array
        const topicos = Array.isArray(questao.Topicos) ? questao.Topicos : [];
        return topicos.some(topico => topicosIds.includes(topico.id));
      });
    }
    if (pergunta) {
      questoesFiltradas = questoes.filter(questao => questao.pergunta.toLowerCase().includes(pergunta.toLowerCase()));
    }

    let errorMessage = req.session.errorMessage;

    if (errorMessage === null) {
      errorMessage = " ";
    }

    req.session.errorMessage = null;
    res.status(200).render('professor/minhas-questoes', { questoes: questoesFiltradas, totalPages, page, Areas, topicos, errorMessage });
  } catch (err) {
    req.session.destroy();
    res.status(500).redirect('/usuario/inicioLogado');
  };
});

roteador.get('/topicos', async (req, res) => {
  const usuarioId = req.session.idUsuario;
  const limit = 10; // Número de questões por página
  const { materia } = req.query;
  const page = parseInt(req.query.page) || 1; // Página atual, padrão é 1
  const offset = (page - 1) * limit;
  let topicos;
  try {

    // Dentro do bloco try da rota '/questoes'
    const topicosCount = await Topico.count({
      where: {
        usuarioId: usuarioId,
      },
    });

    const totalPages = Math.ceil(topicosCount / limit);

    const topicosSemFiltro = await Topico.findAll({
      where: {
        usuarioId: usuarioId,
      },
      limit: limit,
      offset: offset,
    });

    if (materia) {
      topicos = topicosSemFiltro.filter(topico => topico.materia.toLowerCase().includes(materia.toLowerCase()));
      console.log(topicos)
    } else {
      topicos = topicosSemFiltro
    }
    let errorMessage = req.session.errorMessage;

    if (errorMessage === null) {
      errorMessage = " ";
    }

    req.session.errorMessage = null;
    res.status(200).render('professor/meus-topicos', { topicos, totalPages, page, errorMessage });

  } catch (err) {
    req.sesssion.destroy();
    res.status(500).redirect('/usuario/inicioLogado');
  };

});
roteador.post('/editar-topico', async (req, res) => {
  try {
    const { id, materia } = req.body;
    // Encontre o tópico pelo ID
    const topico = await Topico.findByPk(id);
    if (!topico) {
      return res.status(404).send('Tópico não encontrado.');
    }
    // Atualize o tópico com a nova matéria
    await topico.update({ materia });
    res.redirect('/professor/topicos');
  } catch (error) {
    console.error(error);
    req.session.errorMessage = err.message;
    res.redirect('back')
  }
});
roteador.get('/topicos/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const topics = await Topico.findAll({
      where: { areaId: id },
      // Selecione apenas os atributos necessários
    });

    res.status(200).json(topics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar tópicos' });
  }
});

roteador.get('/editar-questao/:id', async (req, res) => {
  const { id } = req.params;


  try {

    const Topicos = await Topico.findAll()

    const Areas = await Area.findAll({
      include: [{
        model: Topico,
        as: 'Topico' // Ajuste conforme necessário, dependendo de como você configurou a associação
      }]

    })
    const questao = await Questões.findByPk(id, {
      include: [{
        model: Opcao,
        as: 'Opcoes' // Certifique-se de que este alias corresponda ao definido na associação
      }, {
        model: Topico,
        as: 'Topicos'
      }]
    });

    if (!questao) {
      return res.status(404).send('Questão não encontrada');
    }

    let errorMessage = req.session.errorMessage;

    if (errorMessage === null) {
      errorMessage = " ";
    }

    req.session.errorMessage = null;

    // res.send(JSON.stringify(questao))
    res.render('professor/editar-questao', { questao, Topicos, Areas, errorMessage});
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao buscar questão');
  }

});







// rota incompleta
roteador.patch('/editar-questao', async (req, res) => {
  try {
    const { id, titulo, pergunta, resposta, correta } = req.body;
    const { areaId, topicosSelecionados, dados } = req.body;

    await atualizarRelacaoTopicos(id, topicosSelecionados, areaId);

    const questao = await Questões.findByPk(id, {
      include: [{
        model: Opcao,
        as: 'Opcoes'
      }
      ]
    });


    if (!questao) {
      return res.status(404).send('Questão não encontrada');
    }

    // Atualiza informações gerais da questão
    await Questões.update({
      titulo: titulo,
      pergunta: pergunta,
      resposta: resposta,

    }, {
      where: { id: id }
    });

    const opcoes = JSON.parse(dados)

    for (const opcao of opcoes) {
      // Corrige o índice baseado no array opcoesIds

      // Atualiza descrição da opção
      const opcaoAnterior = await Opcao.findByPk(opcao.id)

      if (opcaoAnterior.descricao.startsWith("/uploads")) {
        await removeFileFromUploads(opcaoAnterior.descricao);
      }

      await Opcao.update({
        descricao: opcao.resposta,
      }, {
        where: {
          id: opcaoAnterior.id
        }
      });
    }

    if (correta !== undefined && parseInt(correta) > 0) { // Validação básica
      await Opcao.update({
        correta: false
      }, {
        where: { questao_id: questao.id }
      });

      await Opcao.update({
        correta: true
      }, {
        where: {
          id: parseInt(correta)
        }
      });
    }

    res.redirect('/professor/questoes');
  } catch (error) {
    console.error(error);
    req.session.errorMessage = err.message;
    res.redirect('back')
  }
});

roteador.post('/registrar-topico', async (req, res) => {
  try {
    const { topico, areaIdTopico } = req.body;
    const usuarioId = req.session.idUsuario;

    // Verifica se os campos obrigatórios estão preenchidos
    if (!topico || !areaIdTopico || !usuarioId) {
      return res.status(400).json({ message: 'Os campos tópico e areaId são obrigatórios.' });
    }

    // Cria um novo tópico
    const novoTopico = await Topico.create({
      materia: topico, // Supondo que cada tópico seja uma string
      areaId: areaIdTopico, // Corrigido para usar areaIdTopico
      usuarioId: usuarioId
    });

    // Retorna o novo tópico criado como resposta JSON
    return res.status(201).json(novoTopico); // Status 201 para criação bem-sucedida

  } catch (error) {
    console.error(error);
    req.session.errorMessage = err.message;
    res.redirect('back')
  }
});

// Rota para excluir uma questão
roteador.delete('/excluir-questao/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Busca a questão pelo ID
    const questao = await Questões.findByPk(id);

    if (!questao) {
      return res.status(404).send('Questão não encontrada');
    }

    // Exclui as opções da questão
    await Opcao.destroy({
      where: { questao_id: questao.id }
    });

    // Exclui a questão
    await questao.destroy();

    res.status(200).redirect('/usuario/inicioLogado')
  } catch (error) {
    console.error(error);
    req.session.errorMessage = err.message;
    res.redirect('back')
  }
});


module.exports = roteador;