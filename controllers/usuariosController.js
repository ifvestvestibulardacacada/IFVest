const { Router } = require('express');
const { Usuario } = require('../models');
const { Simulados } = require('../models');

const simulados = require('./simuladosController')
const roteador = Router()
const bcrypt = require('bcrypt');

roteador.get('/perfil', async (req, res) => {
  const id = req.session.idUsuario;
  try {
    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      throw new Error("Usuario não encontrado")
    }
    res.status(200).render('usuario/perfil_usuario', { usuario });
  } catch (err) {
    console.error(err)
    res.redirect('/perfil');
  }
});

roteador.get('/inicioLogado', async (req, res) => {
  const id = req.session.idUsuario;
  try {
    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      throw new Error("Usuario não encontrado")
    }
    res.status(200).render('usuario/inicio-logado');
  } catch (err) {
    console.error(err)
    req.session.destroy();
    res.redirect('/login');
  }
});

roteador.get('/editar', async (req, res) => {
  try {
    let errorMessage = req.session.errorMessage;

    if (!req.session.idUsuario) {
      throw new Error('Você precisa estar logado para acessar esta página.');
    }
    const usuario = await Usuario.findByPk(req.session.idUsuario);

    if (!usuario) {
      throw new Error('Usuário não encontrado.');
    }


    if (errorMessage === null) {
      errorMessage = " ";
    }

    req.session.errorMessage = null;
    res.render('usuario/editar-usuario', { usuario, session: req.session, errorMessage });
  } catch (err) {
    console.error(err)
    res.redirect('/login');
  }
});

roteador.patch('/editar/:id', async (req, res) => {
  try {
    const id = req.session.idUsuario;
    const idUsuarioParaEditar = Number(req.params.id);

    if (id !== idUsuarioParaEditar) {
      req.session.destroy();
    }

    const { senha, nome, usuario, email, novasenha } = req.body;

    if(!nome & !usuario & !email){
      throw new Error('Um dos campos deve ser preenchido.');
    }

    if (senha && novasenha) {
      const usuarioAtual = await Usuario.findByPk(idUsuarioParaEditar);

      if (!usuarioAtual) {
        throw new Error('Usuario não encontrado.');
      }

      const senhaCorreta = await bcrypt.compare(senha, usuarioAtual.senha);

      if (!senhaCorreta) {
        throw new Error('A senha ou usuario atual está incorreto.');
      }

      const novaSenhaHash = await bcrypt.hash(novasenha, 10); // Hash da nova senha

      if (!novaSenhaHash) {
        throw new Error('Senha não alterada.');
      }

      await Usuario.update({ senha: novaSenhaHash }, { where: { id: idUsuarioParaEditar } });
    }

   
    nome? await Usuario.update({nome: nome},{ where: { id: idUsuarioParaEditar } }) : "";
    usuario? await Usuario.update({usuario: usuario},{ where: { id: idUsuarioParaEditar } }) : ""; 
    email? await Usuario.update({email: email},{ where: { id: idUsuarioParaEditar } }) : "";


    res.status(200).redirect(`/usuario/perfil`);
  } catch (err) {
    console.error(err);
    req.session.errorMessage = err.message;
    res.redirect('back')
  }
});


roteador.delete('/:id', async (req, res) => {

  const id = req.session.idUsuario;
  try {
    if (id != req.params.id) {
      throw new Error("Erro ao excluir usuario")
    }

    await Usuario.destroy({
      where: {
        id: req.params.id
      }
    }
    );
    req.session.destroy();
    res.status(200).redirect('/usuario/login');
  } catch (err) {
    console.log(err)
    req.session.errorMessage = err.message;
    res.redirect('back')
  }
});

roteador.get('/sobreNos', (req, res) => {
  res.status(200).render('desenvolvedores/sobreNos');
});


module.exports = roteador;

