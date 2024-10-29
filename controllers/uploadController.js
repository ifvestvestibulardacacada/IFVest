const { express, Router } = require('express');
const { Usuario } = require('../models');
const upload = require('../midlewares/multerConfig');
const { removeFileFromUploads } = require('../utils/removeImage')
const roteador = Router();

roteador.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      throw new Error('Nenhum arquivo enviado.');
    }

    const idUsuario = req.session.idUsuario;
    const caminhoImagem = `/uploads/${req.file.filename}`;

    const usuario = await Usuario.findByPk(idUsuario)

    if (usuario.imagemPerfil) {
      removeFileFromUploads(usuario.imagemPerfil);
    }

    if(!caminhoImagem){
      throw new Error('Nenhum arquivo enviado.');
    }

    await Usuario.update({ imagemPerfil: caminhoImagem }, { where: { id: idUsuario } });

    req.session.imagemPerfil = caminhoImagem;

    res.status(200).redirect(`/usuario/perfil`);
  } catch (error) {
    console.error(error);
    req.session.errorMessage = error.message;
    res.redirect('back')
  }
});

roteador.post('/editor', upload.single('image'), async (req, res) => {

  try {
    if (!req.file) {
      throw new Error('Nenhum arquivo enviado.');
    }
    const url = `/uploads/${req.file.filename}`;

    res.status(200).json(url);
  } catch (error) {
    console.error(error);
    req.session.errorMessage = error.message;
    res.redirect('back')
   
  }
});


module.exports = roteador;