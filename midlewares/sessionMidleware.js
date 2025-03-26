const express = require('express')

const secure_pass = (req, res, next) => {
    if (req.session.login || req.path === '/login') {
        next();
    } else {
        res.redirect('/home');
    }
};

const sessionGlobals = async (req, res, next) => {
    if (req.session.perfil) {
        res.locals.perfilUsuario = req.session.perfil;
        res.locals.nomeUsuario = req.session.nomeUsuario;
        res.locals.imagemPerfil = req.session.imagemPerfil;
    } else {
        console.log('ID de usuário não está definido na sessão');
    }
    next();
};

module.exports = { secure_pass, sessionGlobals };
