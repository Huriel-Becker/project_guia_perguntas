const Sequelize = require('sequelize');

const connection = new Sequelize('guiaperguntas', 'root', 'admin', {
    host: 'localhost',
    dialect: 'mysql',
});

module.exports = connection;