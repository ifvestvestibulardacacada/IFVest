/**
 * Controller responsável pela manipulação de uploads de imagens.
 * 
 * Este controller oferece duas rotas principais:
 * 1. '/': Para atualizar a imagem de perfil do usuário.
 * 2. '/editor': Para obter a URL temporária de uma imagem enviada.
 */

const { express, Router } = require('express');
const { Usuario } = require('../models');
const upload = require('../midlewares/multerConfig');
const { removeFileFromUploads } = require('../utils/removeImage')

const roteador = Router();

/**
 * Rota POST para atualizar a imagem de perfil do usuário.
 * 
 * Esta rota recebe uma imagem, a salva e atualiza o banco de dados.
 * 
 * @route POST /
 * @param {string} image - Nome do campo do formulário que contém a imagem.
 */
roteador.post('/', upload.single('image'), async (req, res) => {
  try {
    // Verifica se uma imagem foi enviada
    if (!req.file) {
      throw new Error('Nenhum arquivo enviado.');
    }

    const idUsuario = req.session.idUsuario;
    const caminhoImagem = `/uploads/${req.file.filename}`;

    // Obtém o usuário atual
    const usuario = await Usuario.findByPk(idUsuario);

    // Remove a imagem antiga se existir
    if (usuario.imagemPerfil) {
      removeFileFromUploads(usuario.imagemPerfil);
    }

    // Verifica se uma nova imagem foi recebida
    if (!caminhoImagem) {
      throw new Error('Nenhum arquivo enviado.');
    }

    // Atualiza o banco de dados com a nova imagem
    await Usuario.update({ imagemPerfil: caminhoImagem }, { where: { id: idUsuario } });

    // Atualiza a sessão com a nova imagem
    req.session.imagemPerfil = caminhoImagem;

    // Redireciona para a página de perfil
    res.status(200).redirect(`/usuario/perfil`);
  } catch (error) {
    console.error(error);
    req.session.errorMessage = error.message;
    res.redirect('back');
  }
});

/**
 * Rota POST para obter a imagem enviada pelo editor de texto.
 * A imagem e salva na pasta uploads e a url retornada
 * 
 * @route POST /editor
 * @param {string} image - Nome do campo do formulário que contém a imagem.
 */
roteador.post('/editor', upload.single('image'), async (req, res) => {
  try {
    // Verifica se uma imagem foi enviada
    if (!req.file) {
      throw new Error('Nenhum arquivo enviado.');
    }

    const url = `/uploads/${req.file.filename}`;

    // Retorna a URL da imagem como JSON
    res.status(200).json(url);
  } catch (error) {
    console.error(error);
    req.session.errorMessage = error.message;
    res.redirect('back');
  }
});

module.exports = roteador;