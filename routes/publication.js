const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const publicationCtrl = require('../controllers/publication');
const multerPublications = require('../middleware/multer-config-publications');

router.get('/:id', auth, publicationCtrl.getOnePublication);
router.get('/', auth, publicationCtrl.getAllPublications);

router.post('/', auth, multerPublications, publicationCtrl.createPublication);

router.delete('/:id', auth, publicationCtrl.deleteOnePublication);

module.exports = router;