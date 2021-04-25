const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const publicationCtrl = require('../controllers/publication');

const multer = require('../middleware/multer-config');

// PUBLICATION ROUTES
router.post('/', auth, multer, publicationCtrl.createPublication);
router.get('/', auth, publicationCtrl.getAllPublications);
router.delete('/:id', auth, publicationCtrl.deletePublication);

module.exports = router;

