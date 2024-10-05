const { Router } = require('express');
const { Usuario } = require('../models');
const { Favorito } = require('../models');
const { Topico } = require('../models');
const { Vestibular } = require('../models');
const { Simulados } = require('../models');
const { Questões } = require('../models');
const { Area } = require('../models');
const { Opcao } = require('../models');
const { PerguntasProvas } = require('../models');
const { Resposta } = require('../models');
const roteador = Router()
const { Op } = require('sequelize');
const QuillDeltaToHtmlConverter = require('quill-delta-to-html').QuillDeltaToHtmlConverter;
const PDFDocument = require('pdfkit');
const fs = require('fs');
// Rota para visualizar questionários
// simuladosController.js

roteador.get('/:id/editar', async (req, res) => {
  const simuladoId = req.params.id

  const simulado = await Simulados.findOne({
    where: { id: simuladoId },

  });
  res.render('simulado/editar-simulado', { simulado });
});

roteador.patch('/:simuladoId/editar', async (req, res) => {
  try {
    const { simuladoId } = req.params; // Corrigindo a desestruturação para usar simuladoId
    const { titulo, descricao, tipo } = req.body; // Corrigindo a desestruturação para usar titulo e descricao

    const [updated] = await Simulados.update({
      titulo: titulo,
      descricao: descricao,
      tipo: tipo

    }, {
      where: { id: simuladoId } // Usando simuladoId para buscar o simulado a ser atualizado
    });

    if (!updated) {
      throw new Error('Simulado não encontrado ou não atualizado');
    }
    res.redirect("/usuario/Simulados")

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

roteador.get('/meus-simulados', async (req, res) => {
  try {
    const idUsuario = req.session.idUsuario;
    const page = parseInt(req.query.page) || 1; // Página atual
    const limit = 10; // Número de itens por página
    const offset = (page - 1) * limit;

    const allSimulados = await Simulados.findAll({
      where: { usuarioId: idUsuario },
      order: [['createdAt', 'DESC']] // Ordena os simulados pela data de criação
    });

    const totalPages = Math.ceil(allSimulados.length / limit);
    const startIndex = offset;
    const endIndex = offset + limit;
    const simuladosPaginated = allSimulados.slice(startIndex, endIndex);

    res.render('simulado/meus-simulados', { simulados: simuladosPaginated, currentPage: page, totalPages });
  } catch (error) {
    console.error(error);
    res.status(500).send('Ocorreu um erro ao recuperar os questionários.');
  }
});

// Rota para visualizar questionários
// simuladosController.js

// Rota para visualizar questionários
roteador.get('/visualizar', async (req, res) => {
  try {
    // 
    // const tiposPermitidos = ['DISSERTATIVO', 'OBJETIVO', 'ALEATORIO'];
    let simulados;
    // if (!tiposPermitidos.includes(tipo)) {
    //   return res.status(400).send('Tipo de simulado inválido.');
    

    const todosSimulados = await Simulados.findAll({
      where: {
        
        '$Questões.id$': {
          [Op.not]: null
        },
        '$Usuario.perfil$': 'PROFESSOR'
      },
      include: [
        {
          model: Questões,
          as: 'Questões'
        },
        {
          model: Usuario, // Inclui o modelo Usuario para acessar o perfil do usuário
          as: 'Usuario', // Ajuste conforme necessário, dependendo de como você configurou a associação
          attributes: ['perfil'], // Seleciona apenas o campo 'perfil' do usuário
          where: {
            perfil: 'PROFESSOR' // Garante que apenas usuários com perfil 'PROFESSOR' sejam incluídos
          }
        }
      ]
    });

    simulados = todosSimulados;
    // Filtra os simulados pelo título, se o parâmetro de consulta 'titulo' estiver presente
    const tituloBusca = req.query.titulo;
    if (tituloBusca) {
      simulados = todosSimulados.filter(s => s.titulo.toLowerCase().includes(tituloBusca.toLowerCase()));
    } 

    const tipo =  req.query.tipo;
    if (tipo) {
      simulados = todosSimulados.filter(s => s.tipo.includes(tipo));
    } 
    
    res.render('simulado/simulados', { simulados });
  } catch (error) {
    console.error(error);
    res.status(500).send('Ocorreu um erro ao recuperar os questionários.');
  }
});

// Rota para associar uma pergunta a um questionário (formulário)
// Exemplo de rota com paginação
roteador.get('/:simuladoId/remover-questoes', async (req, res) => {
  try {
    const simuladoId = req.params.simuladoId;
    const { titulo } = req.query;
    const page = parseInt(req.query.page) || 1; // Página atual
    const limit = 10; // Número de itens por página
    const offset = (page - 1) * limit;

    // Primeiro, busque o simulado sem incluir questões
    const simulado = await Simulados.findOne({
      where: { id: simuladoId },
      include: [
        {
          model: Questões,
          as: 'Questões', through: { attributes: [] }
        }
      ]
    });

    if (!simulado) {
      // Trate o caso em que o simulado não é encontrado
      return res.status(404).send('Simulado não encontrado');
    }

    // Verifique se simulado.Questões existe e tem itens
    const questaoIds = simulado.Questões && simulado.Questões.length > 0 ? simulado.Questões.map(questao => questao.id) : [];

    // Em seguida, busque as questões associadas, se necessário
    const todasQuestoes = await Questões.findAll({
      where: { id: { [Op.in]: questaoIds } },
      include: [{
        model: Simulados,
        as: 'Simulados',
        where: { id: simuladoId },
        through: { attributes: [] }
      }],
      limit: limit,
      offset: offset
    });

    let questoes = todasQuestoes;
    if (titulo) {
      questoes = todasQuestoes.filter(questao => questao.titulo.toLowerCase().includes(titulo.toLowerCase()));
    }
    // Calcule o número total de páginas
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

    // Agora, o objeto simulado deve estar disponível, mesmo que não tenha questões
    res.render('simulado/remover-questoes', { simulado: simulado, questoes: questoes, page: page, totalPages: totalPages });
  } catch (error) {
    console.error('Erro ao carregar o formulário de edição do simulado:', error);
    res.status(500).send('Erro ao carregar o formulário de edição do simulado.');
  }
});

// Em algum arquivo de serviço ou controlador onde você busca as questões do simulado

roteador.get('/:simuladoId/adicionar-questoes', async (req, res) => {
  try {
    const simuladoId = req.params.simuladoId;
    const { titulo, areaId, topicosSelecionados } = req.query;
    // Obtem o texto de filtragem e o ID da área do query string
    const page = parseInt(req.query.page) || 1; // Página atual
    const limit = 10; // Número de questões por página
    const offset = (page - 1) * limit;
    const simulado = await Simulados.findOne({
      where: { id: simuladoId },
      include: [{
        model: Questões,
        as: 'Questões'
      }]
    });

    if (!simulado) {
      return res.status(404).send('Simulado não encontrado.');
    }


    // Buscar todos os tópicos disponíveis
    const topicos = await Topico.findAll();
    const Areas = await Area.findAll({
      include: [{
        model: Topico,
        as: 'Topico' // Ajuste conforme necessário, dependendo de como você configurou a associação
      }]
    });
    // Consulta todas as questões
    const todasQuestoes = await Questões.findAll({
      include: [
        {
          model: Topico,
          as: 'Topicos',
          through: { attributes: [] }, // Exclui os atributos da tabela de junção se houver
        },

      ],
    });
    const questoesJaAssociadas = simulado.Questões.map(q => q.id);

    const questoesDisponiveis = todasQuestoes.filter(q => !questoesJaAssociadas.includes(q.id));

    // Filtrar questões usando JavaScript
    let questoesFiltradas = questoesDisponiveis;
    if (titulo) {
      questoesFiltradas = questoesFiltradas.filter(questao => questao.titulo.toLowerCase().includes(titulo.toLowerCase()));
    }
    if (areaId && areaId !== "") {
      questoesFiltradas = questoesFiltradas.filter(questao => questao.areaId === Number(areaId));
    }
    if (topicosSelecionados && topicosSelecionados !== "") {
      // Conversão de topicosSelecionados para Array de IDs
      // Se for um array, ele é usado diretamente
      // ele é dividido em um array de strings usando .split(','). Em seguida, cada string é convertida em um número (ID) usando .map(id => parseInt(id)). O resultado é um array de IDs de tópicos.
      const topicosIds = Array.isArray(topicosSelecionados) ? topicosSelecionados : topicosSelecionados.split(',').map(id => parseInt(id));
      questoesFiltradas = questoesFiltradas.filter(questao => {
        // Garante que questao.topicos seja um array
        const topicos = Array.isArray(questao.Topicos) ? questao.Topicos : [];
        return topicos.some(topico => topicosIds.includes(topico.id));
      });
    }


    // Paginação após o filtro
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

    res.render('simulado/associar-pergunta-simulado', { simulado, questoes, page, totalPages, Areas, topicos, questoesPorArea });
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

    // Primeiro, verifique se o questionário e a pergunta existem
    const simulado = await Simulados.findByPk(simuladoId);

    if (!simulado) {
      return res.status(404).send('Simulado não encontrado.');
    }
    if (!idsInteiros) {
      return res.status(404).send('Questões não selecionadas.');
    }

    // Agora, associe as questões ao simulado usando o método addQuestões
    // Este método deve ser definido em sua associação Sequelize entre Simulados e Questões
    await simulado.addQuestões(idsInteiros);


    res.redirect(`/usuario/simulados/`);
  } catch (error) {
    console.error('Erro ao associar Questões a questionário:', error);
    res.status(500).send('Erro ao associar Questões a questionário.');
  }
});

roteador.patch('/:simuladoId/editar', async (req, res) => {
  try {
    const { titulo, descricao } = req.body;
    const { simuladoId } = req.params;


    // Primeiro, verifique se o simulado existe
    const simulado = await Simulados.findOne({
      where: {
        id: simuladoId
      },
    });


    res.redirect(`/usuario/simulados/`);
  } catch (error) {
    console.error('Erro ao remover Questões do questionário:', error);
    res.status(500).send('Erro ao remover Questões do questionário.');
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

    res.redirect(`/usuario/simulados/`);
  } catch (error) {
    console.error('Erro ao remover Questões do questionário:', error);
    res.status(500).send('Erro ao remover Questões do questionário.');
  }
});


//   // Rota para processar as respostas do questionário
//   // Rota para uma prova com alternativas
roteador.get('/:simuladoId/fazer', async (req, res) => {
  try {
    const simuladoId = req.params.simuladoId;

    const simulado = await Simulados.findByPk(simuladoId, {
      include: [{
        model: Questões,
        as: 'Questões', // Certifique-se de que este alias corresponda ao definido na associação
        include: [{
          model: Opcao,
          as: 'Opcoes' // Certifique-se de que este alias corresponda ao definido na associação
        },
        {
          model: Vestibular,
          as: 'vestibular' // Certifique-se de que este alias corresponda ao definido na associação
        }]
      }],

    });

    res.render('prova/prova', { simulado });
//  res.send(simulado)
  } catch (error) {
    console.error('Erro ao buscar perguntas da prova:', error);
    res.status(500).send('Erro ao buscar perguntas da prova.');
  }
});

roteador.get('/:simuladoId/imprimir', async (req, res) => {
  try {
    const simuladoId = req.params.simuladoId;

    // Busca o simulado no banco de dados
    const simulado = await Simulados.findByPk(simuladoId, {
      include: [{
        model: Questões,
        as: 'Questões',
        include: [{
          model: Opcao,
          as: 'Opcoes'
        },
        {
          model: Vestibular,
          as: 'vestibular'
        }]
      }],
    });

    // Crie um novo documento PDF
    const doc = new PDFDocument();

    // Define o cabeçalho para o download do PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="simulado_${simuladoId}.pdf"`);

    // Começa a escrever no PDF
    doc.pipe(res);

    // Título do simulado
    doc.fontSize(18).text(`Simulado: ${simulado.titulo}`, { align: 'center' });
    doc.moveDown();

    // Itera pelas questões do simulado
    simulado.Questões.forEach((questao, questaoIndex) => {
      doc.fontSize(14).text(`Questão ${questaoIndex + 1}: ${questao.titulo}`);
      
      if (questao.tipo === 'OBJETIVA') {
        // Adiciona as opções da questão objetiva
        questao.Opcoes.forEach((opcao, opcaoIndex) => {
          doc.fontSize(12).text(`${String.fromCharCode(97 + opcaoIndex)}) ${opcao.descricao}`);
        });
      } else if (questao.tipo === 'DISSERTATIVA') {
        // Adiciona um espaço para resposta
        doc.moveDown();
        doc.fontSize(12).text('Resposta: _______________________________________________', { continued: true });
        doc.moveDown();
      }

      doc.moveDown(); // Adiciona um espaço entre as questões
    });

    // Finaliza o documento
    doc.end();

  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    res.status(500).send('Erro ao gerar PDF');
  }
});

roteador.get('/:simuladoId/gabarito', async (req, res) => {
  const userId = req.session.idUsuario;
  const simuladoId = req.params.simuladoId;
  try {
    const simulado = await Simulados.findByPk(simuladoId, {
      include: [{
        model: Questões,
        as: 'Questões',
        include: [{
          model: Opcao,
          as: 'Opcoes',
          // Inclui apenas as opções corretas
        },
        ]
      }],
    })

    const questoesComOpcoesCorretas = simulado.Questões;

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
    const dadosParaView = {
      questoes: questoesComOpcoesCorretas,
      respostasUsuario: respostasDoUsuario,
      simulado: simulado
    };
    console.log("respostas:", respostasDoUsuario)
    // Renderiza a view com os dados preparados
    res.render('prova/gabarito', dadosParaView);

    //  res.render('prova/gabaritoProva', { simulado });

  } catch (error) {
    console.error('Erro ao buscar o gabarito da prova:', error);
    res.status(500).send('Erro ao buscar o gabarito da prova.');
  }
});
function formatBrazilianDate(date) {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}


roteador.post('/search', async (req, res) => {
  const searchTerm = req.body.searchTerm.toLowerCase();

  try {
    // Busque todos os simulados usando o modelo Simulados
    const simulados = await Simulados.findAll();

    // Filtrando os resultados pelo nome ou data
    const results = simulados.filter(simulado => {
      const formattedDate = formatBrazilianDate(simulado.createdAt);
      return simulado.titulo.toLowerCase().includes(searchTerm) || formattedDate.includes(searchTerm);
    });

    res.render('simulado/pesquisa', { simulados: results, searchTerm, });
  } catch (error) {
    console.error('Erro ao buscar simulados:', error);
    res.status(500).send('Erro ao buscar simulados.');
  }
  //topico e area
});



roteador.post('/responder-prova/:provaId', async (req, res) => {
  const { questoes, respostas } = req.body;
  const { idUsuario } = req.session;
  const { provaId } = req.params;
  const respostasDissertativas = respostas;

  const simulado = await Simulados.findByPk(provaId)
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
          provaId: provaId, // Ajuste conforme necessário
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
          provaId: provaId, // Ajuste conforme necessário
          questaoId: questaoId,
        });
      }
    }
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (simulado.tipo === "OBJETIVO") {
      res.status(200).redirect(`/usuario/simulados/${simulado.id}/gabarito`)
    } else {
      res.redirect(`/usuario/simulados/`);
    }


    // substituir por um redirect para a pagina do gabarito
  } catch (error) {
    console.error('Erro ao salvar respostas associadas:', error);
    return res.status(500).send('Erro ao salvar respostas associadas.');
  }
});

module.exports = roteador;