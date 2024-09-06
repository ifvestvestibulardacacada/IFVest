const comentarios = require('./comentariosController');
const usuarios = require('./usuariosController');
const AreaProfessor = require('./AreaProfessorController');
const inicio = require('./inicioController');
const professor = require('./professorController');
const simulados = require('./simuladosController');
const uploads = require('./uploadController');
const informacao = require('./informacaoController');

const controllers = {
    comentarios: comentarios,
    usuarios: usuarios,
    AreaProfessor: AreaProfessor,
    inicio: inicio,
    professor: professor,
    simulados: simulados,
    uploads: uploads,
    informacao: informacao,
  
}

module.exports = controllers;