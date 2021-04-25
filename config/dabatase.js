const mysql = require('mysql');

module.exports = mysql.createConnection({
    host: process.env.HOST_DB,
    user: process.env.USERNAME_DB,
    password: process.env.PASSWORD_DB,
    database: process.env.NAME_DB,
});