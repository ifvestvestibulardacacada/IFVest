const { express, Router } = require('express');
const { Usuario } = require('../models');
const upload = require('../midlewares/multerConfig'); // Importa a configuração do Multer
const {removeFileFromUploads} = require('../utils/removeImage')
const roteador = Router();

roteador.post('/', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('Nenhum arquivo enviado.');
    }

    const idUsuario = req.session.idUsuario;
    const caminhoImagem = `/uploads/${req.file.filename}`;

    // Atualiza o campo imagemPerfil do usuário no banco de dados
    const usuario = await Usuario.findByPk(idUsuario)
     
    if(usuario.imagemPerfil){
        await removeFileFromUploads(usuario.imagemPerfil);
    }

    await Usuario.update({ imagemPerfil: caminhoImagem }, { where: { id: idUsuario } });

    // Atualiza a sessão do usuário com o novo caminho da imagem
    req.session.imagemPerfil = caminhoImagem;

    return res.status(200).redirect(`/usuario/perfil`);
});
roteador.post('/editor', upload.single('image'), async (req, res) => {
    if (!req.file) {
      return res.status(400).send('Nenhum arquivo enviado.');
    }
  
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedMimes.includes(req.file.mimetype)) {
      return res.status(400).send('Tipo de arquivo inválido.');
    }
  
    const url = `/uploads/${req.file.filename}`;
  
    try {
      // Lógica adicional para compressão da imagem, se necessário
      // ...
  
      return res.status(200).json({ url });
    } catch (error) {
      console.error(error);
      return res.status(500).send('Erro ao salvar a imagem.');
    }
  });


module.exports = roteador;