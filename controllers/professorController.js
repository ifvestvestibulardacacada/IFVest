const { Router } = require('express');
const { Topico } = require('../models');
const { Opcao } = require('../models');
const { Simulados } = require('../models');
const { Questões } = require('../models');
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
    const { titulo, pergunta, areaId, correta, topicosSelecionados, respostasSelecionadas } = req.body;
    const tipo = req.params.tipo.toUpperCase()

    if (!respostasSelecionadas) {
      throw new Error("Respostas não pode ser vazio")
    }


    const ArrayRespostas = JSON.parse(respostasSelecionadas);

    const numOpcoes = Object.keys(ArrayRespostas).length;

    const alternativas = ['A', 'B', 'C', 'D', 'E'];

    const opcoes = alternativas.slice(0, numOpcoes).map(alternativa => ({
      alternativa,
      descricao: ArrayRespostas[`#opcao${alternativa}`]  // Descrição padrão se não existir
    }));

    const usuarioId = req.session.idUsuario;

    if (!topicosSelecionados) {
      throw new Error("Selecione pelo menos um tópico")
    }


    const createQuestao = await Questões.create({
      pergunta: pergunta,
      titulo,
      areaId,
      usuarioId,
      tipo // Usa o novo ID do vestibular
    });


    await createQuestao.addTopicos(topicosSelecionados)

    for (let opcao of opcoes) {
      let isTrue = correta === opcao.alternativa ? true : false;
      await Opcao.create({
        questao_id: createQuestao.id,
        descricao: JSON.stringify(opcao.descricao),
        alternativa: opcao.alternativa,
        correta: isTrue

      })
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
  const { titulo, areaId, topicosSelecionados, pergunta } = req.query; // Adiciona 'pergunta' aos parâmetros recuperados
  const limit = 10; // Número de questões por página
  const page = parseInt(req.query.page) || 1; // Página atual, padrão é 1
  const offset = (page - 1) * limit;

  try {
    let questoes = await Questões.findAll({
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
    req.session.errorMessage = error.message;
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
    const Topicos = await Topico.findAll({
      where: {
        areaId: questao.areaId
      }
    })
    const Opcoes = await Opcao.findAll({
      where: {
        questao_id: questao.id
      },
      order: [['alternativa', 'ASC']] // Ordena as opções pela coluna 'alternativa' em ordem ascendente
    });
    const correta = Opcoes.filter(opcao => opcao.correta === true);



    let errorMessage = req.session.errorMessage;

    if (errorMessage === null) {
      errorMessage = " ";
    }

    req.session.errorMessage = null;

    // res.send(JSON.stringify(questao))
    res.render('professor/editar-questao', { questao, Topicos, Areas, errorMessage, Opcoes, correta });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao buscar questão');
  }

});







// rota incompleta
roteador.patch('/editar-questao', async (req, res) => {
  try {
    const { id, titulo, pergunta, correta, respostasSelecionadas } = req.body;
    const { areaId, topicosSelecionados } = req.body;

    const ArrayRespostas = JSON.parse(respostasSelecionadas)


    const numOpcoes = Object.keys(ArrayRespostas).length;

    const alternativas = ['A', 'B', 'C', 'D', 'E'];

    const opcoes = alternativas.slice(0, numOpcoes).map(alternativa => ({
      alternativa,
      descricao: ArrayRespostas[`#opcao${alternativa}`].content,
      id: ArrayRespostas[`#opcao${alternativa}`].id// Descrição padrão se não existir
    }));


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

    await Questões.update({
      titulo: titulo,
      pergunta: pergunta,


    }, {
      where: { id: id }
    });

    if (!opcoes) {
      throw new Error("Selected answers cannot be empty");
    }
    for (let opcao of opcoes) {
      // Inicializa o objeto de atualização
      const updateData = {
        descricao: JSON.stringify(opcao.descricao),
        alternativa: opcao.alternativa,
      };


      if (correta) {
        updateData.correta = correta === opcao.alternativa;
      }

      await Opcao.update(updateData, {
        where: { id: opcao.id }
      });
    }
    res.redirect('/professor/questoes');
  } catch (error) {
    console.error(error);
    req.session.errorMessage = error.message;
    res.redirect('back')
  }
});

roteador.post('/registrar-topico', async (req, res) => {
  try {
    const { topico, areaIdTopico } = req.body;
    const usuarioId = req.session.idUsuario;

    // Verifica se os campos obrigatórios estão preenchidos
    if (!topico || !areaIdTopico || !usuarioId) {
      throw new Error('Os campos tópico e areaId são obrigatórios.');
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
    req.session.errorMessage = error.message;
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
    req.session.errorMessage = error.message;
    res.redirect('back')
  }
});


module.exports = roteador;