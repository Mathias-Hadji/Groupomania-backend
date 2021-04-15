const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const publicationCtrl = require('../controllers/publication');

// PUBLICATION ROUTES
router.post('/', auth, publicationCtrl.createPublication);
router.get('/', auth, publicationCtrl.getAllPublications);
router.delete('/:id', publicationCtrl.deletePublication);

module.exports = router;

