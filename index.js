const express = require('express');
const methodOverride = require('method-override');
const session = require('express-session');
const bodyParser = require('body-parser');
const { usuarios, simulados, inicio, professor, uploads } = require('./controllers');
const sessionOptions = require('./utils/sessionConfig');
const { secure_pass, sessionGlobals } = require('./midlewares/sessionMidleware');
const path = require('path');

// Criar aplicação Express
const app = express();


// Middleware para processar requisições
app.use(bodyParser.json());
app.use(session(sessionOptions));
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuração do EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

// Configuração de diretórios estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware de proteção
app.use(sessionGlobals);

// Rotas
app.use('/', inicio);
app.use(secure_pass);
app.use('/usuario', usuarios);
app.use('/professor', professor);
app.use('/uploads', uploads);
app.use('/simulados', simulados);

// Sincronizar o store de sessões antes de iniciar o servidor
app.listen( 3001, () => {
    console.log('Working on port 3000!')
});
module.exports = { app };

