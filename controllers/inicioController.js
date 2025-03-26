const { Router } = require('express');
const express = require('express');
const { Usuario } = require('../models');
const bcrypt = require('bcrypt');
const roteador = Router()
const jwt = require('jsonwebtoken');

// rota da pagina inicial
roteador.get('/home', (req, res) => {
    res.status(200).render('usuario/inicio');
});
roteador.get('/editor', async (req, res) => {
    res.status(200).render('professor/editor');
})


// rota de deslogar usuario
roteador.post('/logoff', (req, res) => {
    console.log("....deslogando")
    req.session.destroy(() => {
        res.clearCookie('connect.sid');
        res.redirect('/usuario/login');
    });
 

});

// rotas de login
roteador.get('/login', (req, res) => {
    let errorMessage = req.session.errorMessage;
    console.log(errorMessage);
    if (errorMessage === null) {
        errorMessage = " ";
    }
    req.session.errorMessage = null; // Limpa a mensagem de erro após exibi-la
    res.status(200).render('usuario/login', { errorMessage });
});
roteador.post('/login', async (req, res) => {
    const {usuario, senha} =  req.body;
        
 
    // Agora você pode acessar os dados individualmente


    try {
        if (!usuario || !senha) {
            throw new Error("Usuario ou Senha invalidos");
        }

        const usuarioEncontrado = await Usuario.findOne({
            where: { usuario: usuario }
        });

        if (!usuarioEncontrado) {
            throw new Error("Usuario ou Senha invalidos");
        }

        const senhaCorreta = await bcrypt.compare(senha, usuarioEncontrado.senha);

        if (!senhaCorreta) {
            throw new Error("Usuario ou Senha invalidos");
        }
        req.session.regenerate((err) => { 
            if (err) throw err;
        });

        req.session.login = true;
        req.session.idUsuario = usuarioEncontrado.id;
        req.session.perfil = usuarioEncontrado.perfil;
        req.session.nomeUsuario = usuarioEncontrado.usuario;
        req.session.imagemPerfil = usuarioEncontrado.imagemPerfil;

        await new Promise((resolve, reject) => {
            req.session.save(err => {
                if(err) reject(err);
                else resolve();
            });
        });

        return res.redirect('/usuario/inicioLogado');
    } catch (err) {
        console.error(err)
        req.session.errorMessage = err.message;
        return res.redirect('/login');
    }
});

// rotas de cadastro
roteador.get('/cadastro', (req, res) => {
    let errorMessage = req.session.errorMessage;
    console.log(errorMessage);
    if (errorMessage === null) {
        errorMessage = " ";
    }
    req.session.errorMessage = null;
    res.status(200).render('usuario/cadastro', { errorMessage });
});

roteador.post('/cadastro', async (req, res) => {
    const { nome, usuario, senha, email, perfil } = req.body;
    try {
        if (!nome || !usuario || !senha || !email || !perfil) {
            console.log(nome, usuario, senha, email, perfil)
            throw new Error("Dados Invalidos ou Incompletos")
        }
        const senhaCriptografada = await bcrypt.hash(senha, 10); // O segundo argumento é o número de "salt rounds"

        await Usuario.create({ nome, usuario, senha: senhaCriptografada, email, perfil });

        res.status(201).redirect('/login');
    } catch (err) {
        console.error(err)
        req.session.errorMessage = err.message;
        res.status(201).redirect('/cadastro');
    }

});

module.exports = roteador;