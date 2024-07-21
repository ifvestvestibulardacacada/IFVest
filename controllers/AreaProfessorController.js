// const {Router} = require('express');
// const {AreaProf, Usuario} = require('../models');

// const roteador = Router()

// roteador.get('/perfil/compras', async (req, res)=>{
//     const idU = req.session.idUsuario;
//     const perfil = await AreaProf.findAll({

//         where: { UsuarioId: idU},
//         include: [{model: Usuario}]
//     });

//     const idLogin = req.session.idUsuario;
//     res.status(200).render('index', {perfil, idLogin});
// });
// module.exports = roteador;


