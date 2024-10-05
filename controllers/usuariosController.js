const { Router } = require('express');
const { Usuario } = require('../models');
const { Favorito } = require('../models');
const { Topico } = require('../models');
const { Simulados } = require('../models');
const { Questões } = require('../models');
const { Area } = require('../models');
const { PerguntasProvas } = require('../models');
const { Resposta } = require('../models');
const simulados = require('./simuladosController')
const roteador = Router()
const bcrypt = require('bcrypt');
// rota de perfil de usuario removi as outras paginas iguais e adicionei o tipo de perfil ao usuario
roteador.get('/perfil', async (req, res) => {
  const id = req.session.idUsuario;

  const usuario = await Usuario.findByPk(id);

  console.log(usuario.perfil);
  if (usuario == null) {
    res.status(200).redirect('/usuario/login');
  } else {
    res.status(200).render('usuario/perfil_usuario', { usuario});
  }
});


roteador.get('/inicioLogado', async (req, res) => {
  const id = req.session.idUsuario;

  const usuario = await Usuario.findByPk(id);
  if (usuario == null) {
    res.status(200).redirect('/usuario/login');
  } else {

    res.status(200).render('usuario/inicio-logado');
  }

});



//rota de alterar funciona
roteador.get('/editar', async (req, res) => {
  // Certifique-se de que o usuário está autenticado e tem uma sessão
  if (!req.session.idUsuario) {
      return res.status(403).send('Você precisa estar logado para acessar esta página.');
  }

  // Recupera o usuário do banco de dados usando o ID da sessão
  // Substitua 'Usuario' pelo nome do seu modelo de usuário
  const usuario = await Usuario.findByPk(req.session.idUsuario);

  // Verifica se o usuário foi encontrado
  if (!usuario) {
      return res.status(404).send('Usuário não encontrado.');
  }

  // Renderiza a página de edição com os dados do usuário e a sessão
  res.render('usuario/editar-usuario', { usuario, session: req.session });
});

//rota de alterar funciona
 // Certifique-se de ter o bcrypt instalado e importado

roteador.patch('/editar/:id', async (req, res) => {
 try {
    const id = req.session.idUsuario;
    const idUsuarioParaEditar = Number(req.params.id);

    if (id !== idUsuarioParaEditar) {
      return res.status(403).send('Você não tem permissão para editar este perfil.');
    }

    const { senha, nome, usuario, email, novasenha } = req.body;

    // Verificar se a senha atual e a nova senha foram fornecidas
    if (senha && novasenha) {
      // Buscar o usuário pelo ID para verificar a senha atual
      const usuarioAtual = await Usuario.findByPk(idUsuarioParaEditar);

      // Verificar se a senha fornecida corresponde à senha atual
      const senhaCorreta = await bcrypt.compare(senha, usuarioAtual.senha);

      if (!senhaCorreta) {
        return res.status(400).send('A senha atual está incorreta.');
      }

      // Se a senha estiver correta, atualizar a senha para a nova senha
      const novaSenhaHash = await bcrypt.hash(novasenha, 10); // Hash da nova senha
      await Usuario.update({ senha: novaSenhaHash }, { where: { id: idUsuarioParaEditar } });
    }

    // Atualizar outros campos se fornecidos

    const dadosParaAtualizar = {};
    if (nome) dadosParaAtualizar.nome = nome;
    if (usuario) dadosParaAtualizar.usuario = usuario;
    if (email) dadosParaAtualizar.email = email;

    if (Object.keys(dadosParaAtualizar).length > 0) {
      await Usuario.update(dadosParaAtualizar, { where: { id: idUsuarioParaEditar } });
    }

    return res.status(200).redirect(`/usuario/perfil`);
 } catch (err) {
    console.error(err);
    return res.status(500).redirect('/inicio');
 }
});
 

//rota de deletar funciona
roteador.delete('/:id', async (req, res) => {

  const id = req.session.idUsuario;

  try {

    if (id != req.params.id) {
      throw new Error("Erro ao excluir usuario")
    }

    await Usuario.destroy(
      {
        where:
        {
          id: req.params.id
        }
      }
    );
    req.session.destroy();
    res.status(200).redirect('/usuario/login');
  } catch (err) {
    console.log(err)
    console.log("erro ao deletar")
    //req.session.destroy();
    res.status(500).redirect('/inicio');
  }
});

// pagina para criar simulado
roteador.get('/criar-simulado', async (req, res) => {

  res.render('simulado/criar-simulado' );
});

// Rota para lidar com o envio do formulário
roteador.post('/criar-simulado', async (req, res) => {
  const { titulo, descricao, tipo } = req.body;
  const usuarioId1 = req.session.idUsuario;
  const tipoformatado = tipo.toUpperCase()
  if(!titulo || !descricao || !tipo){
    throw new Error("Dados Invalidos !!! ")
  }

  try {
    // Crie um novo questionário no banco de dados usando Sequelize
    const simulado = await Simulados.create({
      titulo,
      descricao,      
      usuarioId: usuarioId1,
      tipo: tipoformatado
    });

    res.redirect(`/usuario/Simulados/${simulado.id}/adicionar-questoes`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Ocorreu um erro ao criar o questionário.');
  }
});
roteador.get('/video', (req, res) => {
  res.status(200).render('conteudo/video', {});
});

roteador.use('/simulados', simulados)

module.exports = roteador;

