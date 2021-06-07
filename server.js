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
const commentRoutes = require('./routes/comment');
const likePublicationRoutes = require('./routes/like-publication');

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

// Protection xss
app.use(xssClean());


// Folder images
app.use('/images', express.static(path.join(__dirname, 'images')));

// Routes
app.use('/api/user', userRoutes);
app.use('/api/publication', publicationRoutes);
app.use('/api/comment', commentRoutes);
app.use('/api/like-publication', likePublicationRoutes);

// Server
const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})




