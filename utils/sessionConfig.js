const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const { Session } = require('../models/Session');
const { Sequelize } = require('sequelize');

const sequelizeSession = new Sequelize({
    username: 'postgres',
    password: 'residentevil6',
    database: 'ifvest2',
    host: 'localhost',
    dialect: 'postgres',
    port: 5432,
});

const sessionOptions = {
    secret: 'frasealeatoria',
    store: new SequelizeStore({ 
        db: sequelizeSession , 
        tableName: "sessions",
        model: Session,
      }),
    resave: false,
    saveUninitialized: false,
    cookie: { 
        maxAge: 24 * 60 * 60 * 1000, // 24 horas
        secure: false // Altere para true se usar HTTPS
    },
    rolling: true,
    genid: (req) => {
      console.log('Session ID generation:', req.sessionID);
      return req.sessionID;
    }
};

module.exports = sessionOptions;
