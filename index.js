const express = require('express');
const methodOverride = require('method-override');
const session = require('express-session');


const { usuarios, simulados, inicio, professor, uploads, informacao } = require('./controllers');

const app = express();

const umDia = 1000 * 60 * 60 * 24;
const sessionOptions = {
    secret: 'frasealeatoria', //será trocada, apenas para testes
    cookie: { maxAge: umDia },
    resave: false,
    saveUninitialized: false
};

app.use(session(sessionOptions));

const secure_pass = (req, res, next) => {
    if (req.session.login || req.path === '/login') {
        next();
    } else {
        res.redirect('/home');
    }
}

const path = require('path');

//Configura as variáveis do Node para a View Engine EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

//Permite obter informações do corpo das requisições
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
//Define diretório para arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
//Define _method como parâmetro para transformar
// de POST para PATCH ou DELETE
app.use(methodOverride('_method'));

app.use(async (req, res, next) => {
    if (req.session.perfil) {

        res.locals.perfilUsuario = req.session.perfil;
        res.locals.nomeUsuario = req.session.nomeUsuario;
        res.locals.imagemPerfil = req.session.imagemPerfil;
    } else {
        console.log('ID de usuário não está definido na sessão');
    }
    next();
});


app.use('/', inicio);
app.use(secure_pass);
app.use('/usuario', usuarios);
// app.use('/simulados', simulados)
app.use('/professor', professor);
app.use("/uploads",  uploads); /// usuario, usuarios(lista com os usuarios)
app.use("/informacao", informacao);
// app.use('/comentario', comentarios); //comentarios do usuario
// app.use('/prof', AreaProfessor);

app.listen(process.env.PORT || 3000, () => {
    console.log('Working on port 3000!')
});
 module.exports = {app};
