// const {Router} = require('express');
// const {Comentario, Usuario} = require('../models');

// const roteador = Router()

// roteador.get('/', async (req, res)=>{
//     const comentarios = await Comentario.findAll({
//         include: [{model: Usuario}]
//     });

//     res.status(200).render('listaComentarios', {comentarios});
// });

// roteador.get('/novo', (req, res)=>{
//     res.status(200).render('new');
// });

// roteador.get('/:id', async (req, res)=>{
//     const {id} = req.params;

//     let comentario = await Comentario.findByPk(id);
//     res.status(200).render('edit', {comentario});
// });

// roteador.post('/', async (req, res)=>{
//     const {comentario} = req.body;
//     const usuarioId = req.session.idUsuario;
//     await Comentario.create({comentario, usuarioId});
//     res.status(201).redirect('/comentario');
// });

// roteador.patch('/:id', async (req, res)=>{
//     let {comentario} = req.body;
//     await Comentario.update({comentario},
//         {
//             where: {id: req.params.id}
//         }
//     );
//     res.status(200).redirect('/comentario');
// });

// roteador.delete('/:id', async (req, res)=>{
//     await Comentario.destroy(
//         {
//             where: 
//             {
//                 id:req.params.id
//             }
//         }
//     );
//     res.status(200).redirect('/comentario');
//     //res.status(200).send(comentarios);
// });

// module.exports = roteador;