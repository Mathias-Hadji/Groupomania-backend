const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const helmet = require('helmet');
const xssClean = require('xss-clean');

const userRoutes = require('./routes/user');
const publicationRoutes = require('./routes/publication');

const db = require('./bdd/dabatase');

db.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// Helmet
app.use(helmet());

// BodyParser
app.use(bodyParser.json());

// Protection xss
app.use(xssClean());

// Routes
app.use('/api/auth', userRoutes);
app.use('/api/publication', publicationRoutes);


module.exports = app;
