const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config({path: './config/.env'});
const helmet = require('helmet');
const xssClean = require('xss-clean');
const path = require('path');
const upload = require('express-fileupload');
const cors = require('cors')

const userRoutes = require('./routes/user');
const publicationRoutes = require('./routes/publication');

const db = require('./config/dabatase');

db.connect(function(err) {
    if (err) {
        console.log('error connecting: ' + err.stack);
        return;
    }
    console.log("Database connected !");
});

// Current Locale
db.query(`SET lc_time_names = 'fr_FR';`, function (error, results, fields) {
    if (error) throw error;
});


db.query(`SET NAMES 'utf8';`, function (error, results, fields) {
    if (error) throw error;
});

const app = express();


// CORS
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

app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.urlencoded({ extended: true}));

app.use(cors())

app.use('/images', express.static(path.join(__dirname, 'images')));

// Protection xss
app.use(xssClean());

// Routes
app.use('/api/user', userRoutes);
app.use('/api/publication', publicationRoutes);

// Server
app.listen(process.env.PORT, () => {
    console.log(`Server is listening on port ${process.env.PORT}`)
})
