'use strict';

const bcrypt = require('bcrypt');
const saltRounds = 10; // Define o número de rounds para o bcrypt

module.exports = {
 up: async (queryInterface, Sequelize) => {
    // Definindo um usuário para inserir no banco de dados
    const usuario = {
      nome: 'ruan',
      usuario: 'ruan177',
      email: 'email@exemplo.com',
      senha: '123', 
      perfil: 'PROFESSOR',// Senha em texto simples
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Criptografando 
    const hashedPassword = await bcrypt.hash(usuario.senha, saltRounds);

    // Inserindo o usuário no banco de dados com a senha criptografada
    await queryInterface.sequelize.query(
      `INSERT INTO "usuarios" ("nome","usuario", "email", "senha","perfil", "createdAt", "updatedAt") VALUES ('${usuario.nome}','${usuario.usuario}','${usuario.email}', '${hashedPassword}', '${usuario.perfil}', NOW(), NOW())`
    );
 },

 down: async (queryInterface, Sequelize) => {
    // Removendo o usuário inserido pelo seed
    await queryInterface.sequelize.query(`DELETE FROM "usuarios" WHERE "email" = 'email@exemplo.com'`);
 }
};