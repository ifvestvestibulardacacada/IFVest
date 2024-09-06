const { Router } = require('express');

const roteador = Router()

// rota da pagina sobre nós
roteador.get('/sobreNos', (req, res) => {
    res.status(200).render('informacao/sobreNos');
});

module.exports = roteador;