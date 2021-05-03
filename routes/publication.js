const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const publicationCtrl = require('../controllers/publication');

const multerPublications = require('../middleware/multer-config-publications');

// PUBLICATION ROUTES
router.post('/', auth, multerPublications, publicationCtrl.createPublication);
router.get('/', auth, publicationCtrl.getAllPublications);
router.delete('/:id', auth, publicationCtrl.deletePublication);

module.exports = router;

