const { Router } = require('express');
const express = require('express');
const { Usuario } = require('../models');
const bcrypt = require('bcrypt');
const roteador = Router()

const app = express()
// rota da pagina inicial
roteador.get('/home', (req, res) => {
    res.status(200).render('usuario/inicio');
});


// rota de deslogar usuario
roteador.post('/logoff', (req, res) => {
    console.log("....deslogando")
    req.session.destroy();
    res.redirect('/usuario/login');
});

// rotas de login
roteador.get('/login', (req, res) => {
    let errorMessage = req.session.errorMessage;
    console.log(errorMessage);
    if(errorMessage === null){
        errorMessage = " ";
    }
    req.session.errorMessage = null; // Limpa a mensagem de erro após exibi-la
    res.status(200).render('usuario/login', { errorMessage });
});

roteador.post('/login', async (req, res) => {
    const { usuario, senha } = req.body;
    try {
        if (!usuario || !senha) {
            throw new Error("Usuario ou Senha invalidos");
        }

        // Buscar o usuário pelo nome de usuário
        const usuarioEncontrado = await Usuario.findOne({
            where: { usuario: usuario }
        });

        if (!usuarioEncontrado) {
            throw new Error("Usuario ou Senha invalidos");
        }

        // Comparar a senha fornecida com a senha criptografada armazenada
        const senhaCorreta = await bcrypt.compare(senha, usuarioEncontrado.senha);

        if (!senhaCorreta) {
            throw new Error("Usuario ou Senha invalidos");
        }

        // Se a senha estiver correta, prosseguir com o login
        req.session.login = true;
        req.session.idUsuario = usuarioEncontrado.id;
        req.session.perfil = usuarioEncontrado.perfil;
        req.session.nomeUsuario = usuarioEncontrado.usuario;
        // Armazena o caminho da imagem de perfil na sessão
        // Certifique-se de que o campo 'imagemPerfil' existe no seu modelo de usuário
        req.session.imagemPerfil = usuarioEncontrado.imagemPerfil;
        
        res.redirect('/usuario/inicioLogado');
    } catch (err) {

        console.error(err)
        req.session.errorMessage = "Usuario ou Senha invalidos";
        res.redirect('/login');
    }
});

// rotas de cadastro
roteador.get('/cadastro', (req, res) => {
    let errorMessage = req.session.errorMessage;
    console.log(errorMessage);
    if(errorMessage === null){
        errorMessage = " ";
    }
    req.session.errorMessage = null;
    res.status(200).render('usuario/cadastro', {errorMessage});
});

roteador.post('/cadastro', async (req, res) => {
    const { nome, usuario, senha, email, perfil } = req.body;
    try{
        if( !nome || !usuario || !senha || !email || !perfil){
            console.log(nome, usuario, senha, email, perfil)
            throw new Error("Dados Invalidos")
        }
        const senhaCriptografada = await bcrypt.hash(senha, 10); // O segundo argumento é o número de "salt rounds"

        await Usuario.create({ nome, usuario, senha: senhaCriptografada, email, perfil });

        res.status(201).redirect('/login');
    }catch(err){
        console.error(err)
        req.session.errorMessage = "Dados Invalidos ou Incompletos";
        res.status(201).redirect('/cadastro');
    }

});

app.use(roteador)
module.exports = app;
