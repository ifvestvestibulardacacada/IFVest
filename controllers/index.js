
const usuarios = require('./usuariosController');

const inicio = require('./inicioController');
const professor = require('./professorController')
const simulados = require('./simuladosController')
const uploads = require('./uploadController')
const informacao = require('./informacaoController');


const controllers = {
    usuarios: usuarios,
    inicio: inicio,
    professor: professor,
    simulados: simulados,
    uploads: uploads,
    informacao: informacao,
  
}

module.exports = controllers;