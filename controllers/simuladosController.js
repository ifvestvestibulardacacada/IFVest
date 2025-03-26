const { Router } = require('express');
const { Usuario } = require('../models');
const { Topico } = require('../models');
const { Vestibular } = require('../models');
const { Simulados } = require('../models');
const { Questões } = require('../models');
const { Area } = require('../models');
const { Opcao } = require('../models');
const { Resposta } = require('../models');
const { Op } = require('sequelize');
const roteador = Router()

roteador.get('/criar-simulado', async (req, res) => {
  let errorMessage = req.session.errorMessage;
  if (errorMessage === null) {
    errorMessage = " ";
  }

  req.session.errorMessage = null;

  res.render('simulado/criar-simulado', { errorMessage });
});

roteador.post('/criar-simulado', async (req, res) => {
  const { titulo, descricao, tipo } = req.body;
  const usuarioId = req.session.idUsuario;
  const tipoformatado = tipo.toUpperCase()

  if (!titulo || !descricao || !tipo) {
    throw new Error("Dados Invalidos !!! ")
  }

  try {
    const simulado = await Simulados.create({
      titulo,
      descricao,
      usuarioId: usuarioId,
      tipo: tipoformatado
    });

    if (!simulado) {
      throw new Error("Simulado não criado!!! ")
    }

    res.redirect(`/simulados/${simulado.id}/adicionar-questoes`);
  } catch (err) {
    console.error(err);
    req.session.errorMessage = err.message;
    res.redirect('back')
  }
});

roteador.get('/:id/editar', async (req, res) => {
  const simuladoId = req.params.id
  try {
    const simulado = await Simulados.findOne({
      where: { id: simuladoId },
    });

    if (!simulado) {
      throw new Error('Simulado não encontrado ');
    }
    let errorMessage = req.session.errorMessage;

    if (errorMessage === null) {
      errorMessage = " ";
    }
    req.session.errorMessage = null;

    res.render('simulado/editar-simulado', { simulado, errorMessage });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

roteador.get('/:simuladoId/imprimir', async (req, res) => {
  try {
    const simuladoId = req.params.simuladoId;
    // Verifique se simuladoId é um número
    if (isNaN(simuladoId) || simuladoId <= 0) {
      return res.status(400).send('ID de simulado inválido');
    }

    const simulado = await Simulados.findByPk(simuladoId, {
      include: [{
        model: Questões,
        as: 'Questões', // Certifique-se de que este alias corresponda ao definido na associação
        include: [{
          model: Opcao,
          as: 'Opcoes' // Certifique-se de que este alias corresponda ao definido na associação
        },
       ]
      }],
    });

    res.render('prova/template-prova', { simulado });
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    res.status(500).send('Erro ao gerar o PDF');
  }
});
roteador.patch('/:simuladoId/editar', async (req, res) => {
  try {
    const { simuladoId } = req.params;
    const { titulo, descricao, tipo } = req.body;

    const [updated] = await Simulados.update({
      titulo: titulo,
      descricao: descricao,
      tipo: tipo
    }, {
      where: {
        id: simuladoId
      }
    });

    if (!updated) {
      throw new Error('Simulado não encontrado ou não atualizado');
    }
    res.redirect("/simulados/meus-simulados")
  } catch (error) {
    console.error(error);
    req.session.errorMessage = err.message;
    res.redirect('back')
  }
});
roteador.get('/meus-simulados', async (req, res) => {
  try {
    const { titulo } = req.query;
    const idUsuario = req.session.idUsuario;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    let allSimulados = await Simulados.findAll({
      where: { usuarioId: idUsuario },
      order: [['createdAt', 'DESC']]
    });

    if (titulo) {
      const simulados = allSimulados.filter(s => s.titulo.toLowerCase().includes(tituloBusca.toLowerCase()));
      allSimulados = simulados
    }

    const totalPages = Math.ceil(allSimulados.length / limit);
    const startIndex = offset;
    const endIndex = offset + limit;
    const simuladosPaginated = allSimulados.slice(startIndex, endIndex);

    let errorMessage = req.session.errorMessage;

    if (errorMessage === null) {
      errorMessage = " ";
    }
    req.session.errorMessage = null;

    res.render('simulado/meus-simulados', { simulados: simuladosPaginated, currentPage: page, totalPages, errorMessage });
  } catch (error) {
    console.error(error);
    res.status(500).send('Ocorreu um erro ao recuperar os questionários.');
  }
});


roteador.get('/visualizar', async (req, res) => {
  try {
    let simulados;

    const todosSimulados = await Simulados.findAll({
      where: {
        '$Questões.id$': {
          [Op.not]: null
        },
        '$Usuario.perfil$': 'PROFESSOR'
      },
      include: [{
        model: Questões,
        as: 'Questões'
      }, {
        model: Usuario,
        as: 'Usuario',
        attributes: ['perfil'],
        where: {
          perfil: 'PROFESSOR'
        }
      }
      ]
    });

    if (!todosSimulados) {
      throw new Error('Simulados não encontrados');
    }
    simulados = todosSimulados;

    const tituloBusca = req.query.titulo;
    if (tituloBusca) {
      simulados = todosSimulados.filter(s => s.titulo.toLowerCase().includes(tituloBusca.toLowerCase()));
    }

    const tipo = req.query.tipo;
    if (tipo) {
      simulados = todosSimulados.filter(s => s.tipo.includes(tipo));
    }

    let errorMessage = req.session.errorMessage;

    if (errorMessage === null) {
      errorMessage = " ";
    }

    req.session.errorMessage = null;

    res.render('simulado/simulados', { simulados, errorMessage });
  } catch (error) {
    console.error(error);
    res.status(500).send('Ocorreu um erro ao recuperar os questionários.');
  }
});

roteador.get('/:simuladoId/remover-questoes', async (req, res) => {
  try {
    const simuladoId = req.params.simuladoId;
    const { titulo } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    const simulado = await Simulados.findOne({
      where: { id: simuladoId },
      include: [
        {
          model: Questões,
          as: 'Questões', through: { attributes: [] },
          
        },
      ]
    });

    if (!simulado) {
      throw new Error('Simulado não encontrado');
    }

    const questaoIds = simulado.Questões && simulado.Questões.length > 0 ? simulado.Questões.map(questao => questao.id) : [];

    const todasQuestoes = await Questões.findAll({
      where: { id: { [Op.in]: questaoIds } },
      include: [{
        model: Simulados,
        as: 'Simulados',
        where: { id: simuladoId },
        through: { attributes: [] }
      }, {
        model: Area, // Ensure you have an Area model defined
        as: 'Area',  // Use the appropriate alias for the relationship
       
      },],
      order: [[{ model: Area, as: 'Area' }, 'area', 'ASC']],
      limit: limit,
      offset: offset
    });

    let questoes = todasQuestoes;

    if (titulo) {
      questoes = todasQuestoes.filter(questao => questao.titulo.toLowerCase().includes(titulo.toLowerCase()));
    }
    const totalQuestoes = await Questões.count({
      where: { id: { [Op.in]: questaoIds } },
      include: [{
        model: Simulados,
        as: 'Simulados',
        where: { id: simuladoId },
        through: { attributes: [] }
      }]
    });
    const totalPages = Math.ceil(totalQuestoes / limit);

    let errorMessage = req.session.errorMessage;

    if (errorMessage === null) {
      errorMessage = " ";
    }

    req.session.errorMessage = null;

    res.render('simulado/remover-questoes', { simulado: simulado, questoes: questoes, page: page, totalPages: totalPages, errorMessage });
  } catch (error) {
    console.error('Erro ao carregar o formulário de edição do simulado:', error);
    res.status(500).send('Erro ao carregar o formulário de edição do simulado.');
  }
});

roteador.get('/:simuladoId/adicionar-questoes', async (req, res) => {
  try {
    const simuladoId = req.params.simuladoId;
    const { titulo, areaId, topicosSelecionados } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    const simulado = await Simulados.findOne({
      where: { id: simuladoId },
      include: [{
        model: Questões,
        as: 'Questões'
      }]
    });

    if (!simulado) {
      throw new Error('Simulado não encontrado.');
    }

    const topicos = await Topico.findAll();
    const Areas = await Area.findAll({
      include: [{
        model: Topico,
        as: 'Topico'
      }]
    });
    const todasQuestoes = await Questões.findAll({
      include: [
        {
          model: Topico,
          as: 'Topicos',
          through: { attributes: [] },
        },

      ],
    });
    const questoesJaAssociadas = simulado.Questões.map(q => q.id);

    const questoesDisponiveis = todasQuestoes.filter(q => !questoesJaAssociadas.includes(q.id));

    let questoesFiltradas = questoesDisponiveis;
    if (titulo) {
      questoesFiltradas = questoesFiltradas.filter(questao => questao.titulo.toLowerCase().includes(titulo.toLowerCase()));
    }
    if (areaId && areaId !== "") {
      questoesFiltradas = questoesFiltradas.filter(questao => questao.areaId === Number(areaId));
    }
    if (topicosSelecionados && topicosSelecionados !== "") {
      const topicosIds = Array.isArray(topicosSelecionados) ? topicosSelecionados : topicosSelecionados.split(',').map(id => parseInt(id));
      questoesFiltradas = questoesFiltradas.filter(questao => {
        const topicos = Array.isArray(questao.Topicos) ? questao.Topicos : [];
        return topicos.some(topico => topicosIds.includes(topico.id));
      });
    }

    const questoes = questoesFiltradas.slice(offset, offset + limit);

    const totalQuestoes = questoesFiltradas.length;
    const totalPages = Math.ceil(totalQuestoes / limit);

    const questoesPorArea = {};

    simulado.Questões.forEach(q => {
      const areaId = q.areaId;
      if (!questoesPorArea[areaId]) {
        questoesPorArea[areaId] = 0;
      }
      questoesPorArea[areaId]++;
    });
    let errorMessage = req.session.errorMessage;

    if (errorMessage === null) {
      errorMessage = " ";
    }

    req.session.errorMessage = null;

    res.render('simulado/associar-pergunta-simulado', { simulado, questoes, page, totalPages, Areas, topicos, questoesPorArea, errorMessage });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao carregar formulário de associação de pergunta');
  }
});

roteador.post('/:simuladoId/adicionar-questoes', async (req, res) => {
  try {
    const { simuladoId } = req.params;
    const { selectedQuestionIds } = req.body;

    const idsInteiros = selectedQuestionIds.split(',').map(Number);

    const simulado = await Simulados.findByPk(simuladoId);

    if (!simulado) {
      throw new Error('Simulado não encontrado.');
    }
    if (!idsInteiros) {
      throw new Error('Questões não selecionadas.');
    }

    await simulado.addQuestões(idsInteiros);

    res.redirect(`/simulados/meus-simulados`);
  } catch (error) {
    console.error(error);
    req.session.errorMessage = err.message;
    res.redirect('back')
  }
});

roteador.patch('/:simuladoId/editar', async (req, res) => {
  try {
    const { titulo, descricao } = req.body;
    const { simuladoId } = req.params;

    const simulado = await Simulados.findOne({
      where: {
        id: simuladoId
      },
    });

    if (!simulado) {
      throw new Error('Simulado não encontrado');
    }

    await simulado.update({
      titulo: titulo || simulado.titulo,
      descricao: descricao || simulado.descricao
    });

    res.redirect(`/simulados/meus-simulados`);
  } catch (error) {
    console.error(error);
    req.session.errorMessage = error.message;
    res.status(400).redirect('back');
  }
});


roteador.delete('/:simuladoId/remover-questoes', async (req, res) => {
  try {
    const { simuladoId } = req.params;
    const { questoesSelecionadas } = req.body;

    // Primeiro, verifique se o simulado existe
    const simulado = await Simulados.findByPk(simuladoId, {
      include: [{
        model: Questões,
        as: 'Questões'
      }]
    });

    if (!simulado) {
      return res.status(404).send('Simulado não encontrado.');
    }
    if (!questoesSelecionadas || questoesSelecionadas.length === 0) {
      return res.status(404).send('Questões não selecionadas.');
    }

    // Agora, remova as questões do simulado usando o método removeQuestoes
    // Este método é fornecido pelo Sequelize para associações belongsToMany
    await simulado.removeQuestões(questoesSelecionadas);

    res.redirect(`/simulados/meus-simulados`);
  } catch (error) {
    console.error(error);
    req.session.errorMessage = err.message;
    res.redirect('back')
  }
});
roteador.delete('/:simuladoId/excluir-simulado', async (req, res) => {
  try {
    const { simuladoId } = req.params;
   
    // Primeiro, verifique se o simulado existe
    const simulado = await Simulados.findByPk(simuladoId, {
      include: [{
        model: Questões,
        as: 'Questões'
      }]
    });

    if (!simulado) {
      return res.status(404).send('Simulado não encontrado.');
    }


    // Agora, remova as questões do simulado usando o método removeQuestoes
    // Este método é fornecido pelo Sequelize para associações belongsToMany


    await simulado.destroy()

    res.redirect(`/simulados/meus-simulados`);
  } catch (error) {
    console.error(error);
    req.session.errorMessage = err.message;
    res.redirect('back')
  }
});


//   // Rota para processar as respostas do questionário
//   // Rota para uma prova com alternativas
roteador.get('/:simuladoId/fazer', async (req, res) => {
  try {
    const simuladoId = req.params.simuladoId;
    let errorMessage = req.session.errorMessage;
    const simulado = await Simulados.findByPk(simuladoId, {   
    });
    const questoes = await Questões.findAll({
      where: {},
      include: [{
        model: Simulados,
        as: 'Simulados',
        where: { id: simuladoId },
        through: { attributes: [] }
      }, {
        model: Area,
        as: 'Area',
      },
      {
        model: Opcao,
        as: 'Opcoes'
      }],
      order: [[{ model: Area, as: 'Area' }, 'area', 'ASC']], // Replace 'name' with the actual column name

    });
    if (errorMessage === null) {
      errorMessage = " ";
    }

    req.session.errorMessage = null;



    res.render('prova/prova', { simulado,questoes, errorMessage, });
    //  res.send(simulado)
  } catch (error) {
    console.error('Erro ao buscar perguntas da prova:', error);
    res.status(500).send('Erro ao buscar perguntas da prova.');
  }
});


roteador.get('/:simuladoId/gabarito', async (req, res) => {
  const userId = req.session.idUsuario;
  const simuladoId = req.params.simuladoId;
  try {
    const simulado = await Simulados.findByPk(simuladoId, {   
    });
    const todasQuestoes = await Questões.findAll({
      where: {},
      include: [{
        model: Simulados,
        as: 'Simulados',
        where: { id: simuladoId },
        through: { attributes: [] }
      }, {
        model: Area,
        as: 'Area',
      },
      {
        model: Opcao,
        as: 'Opcoes'
      }],
      order: [[{ model: Area, as: 'Area' }, 'area', 'ASC']], // Replace 'name' with the actual column name

    });

    const questoesComOpcoesCorretas = todasQuestoes;

    // Consulta as respostas do usuário para cada questão
    const respostasDoUsuario = await Resposta.findAll({
      where: {
        usuarioId: userId,
        questaoId: { [Op.in]: questoesComOpcoesCorretas.map(q => q.id) }
      },
      include: [{
        model: Opcao,
        as: 'opcao',
        required: true
      }],
      order: [['createdAt', 'DESC']],
    });



    // Prepara os dados para a view

    let errorMessage = req.session.errorMessage;

    if (errorMessage === null) {
      errorMessage = " ";
    }

    req.session.errorMessage = null;

    // Renderiza a view com os dados preparados
    res.render('prova/gabarito', {     questoes: todasQuestoes,      
      respostasUsuario: respostasDoUsuario,
      simulado: simulado, errorMessage });

    //  res.render('prova/gabaritoProva', { simulado });

  } catch (error) {
    console.error('Erro ao buscar o gabarito da prova:', error);
    res.status(500).send('Erro ao buscar o gabarito da prova.');
  }
});

roteador.post('/responder-prova/:simuladoId', async (req, res) => {
  const { questoes, respostas } = req.body;
  const { idUsuario } = req.session;
  const { simuladoId } = req.params;
  const respostasDissertativas = respostas;

  const simulado = await Simulados.findByPk(simuladoId)
  try {
    if (questoes && Object.keys(questoes).length > 0) {

      const questoesObj = questoes.reduce((acc, item) => {
        const [questaoId, opcaoId] = item.split('-');
        acc[questaoId] = opcaoId;
        return acc;
      }, {});



      for (let questaoId in questoesObj) {
        const opcaoId = questoesObj[questaoId];

        await Resposta.create({
          resposta: "", // O ID da opção é salvo no campo resposta
          tipo: 'OBJETIVA',
          opcaoId: opcaoId,
          usuarioId: idUsuario, // Ajuste conforme necessário
          simuladoId: simuladoId, // Ajuste conforme necessário
          questaoId: questaoId,
        });
      }
    }

    // Processa as respostas dissertativas, se houver
    if (respostasDissertativas && Object.keys(respostasDissertativas).length > 0) {
      for (let key in respostasDissertativas) {
        const questaoId = key.replace('questao_', '');
        const resposta = respostasDissertativas[key];

        await Resposta.create({
          resposta: resposta,
          tipo: 'DISSERTATIVA',
          usuarioId: idUsuario, // Ajuste conforme necessário
          simuladoId: simuladoId, // Ajuste conforme necessário
          questaoId: questaoId,
        });
      }
    }
    await new Promise(resolve => setTimeout(resolve, 1000));

   
      res.status(200).redirect(`/simulados/${simulado.id}/gabarito`)


  } catch (error) {
    console.error(error);
    req.session.errorMessage = err.message;
    res.redirect('back')
  }
});

module.exports = roteador;