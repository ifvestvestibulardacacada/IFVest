
const usuarios = require('./usuariosController');

const inicio = require('./inicioController');
const professor = require('./professorController')
const simulados = require('./simuladosController')
const uploads = require('./uploadController')


const controllers = {
    usuarios: usuarios,
    inicio: inicio,
    professor: professor,
    simulados: simulados,
    uploads: uploads,
  
}

module.exports = controllers;