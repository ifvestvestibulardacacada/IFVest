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
     
    if(usuario.imagemPerfil.startsWith("/uploads")){
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

    const imageUrl = `/uploads/${req.file.filename}`;

    return res.status(200).send(JSON.stringify(imageUrl));
});


module.exports = roteador;