// Dependencies
const express = require('express');
require('dotenv').config({path: './config/.env'});
const helmet = require('helmet');
const xssClean = require('xss-clean');
const path = require('path');
const cors = require('cors');

const bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
var formidable = require('formidable'),
http = require('http'),
util = require('util');

// Routes
const userRoutes = require('./routes/user');
const publicationRoutes = require('./routes/publication');
const commentRoutes = require('./routes/comment');
const sessionRoutes = require('./routes/session');

// Express App
const app = express();

// CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});
app.use(cors());

// for parsing application/json
app.use(express.json());

// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// multipart/form-data destination
app.use('/images', express.static(path.join(__dirname, 'images')));

// Helmet
app.use(helmet());

// Protection xss
app.use(xssClean());

// Routes
app.use('/api/user', userRoutes);
app.use('/api/publication', publicationRoutes);
app.use('/api/comment', commentRoutes);
app.use('/api/session', sessionRoutes);

// Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})