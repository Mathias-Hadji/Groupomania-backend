const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const publicationCtrl = require('../controllers/publication');
const multerPublications = require('../middleware/multer-config-publications');

router.get('/:id', auth, publicationCtrl.getOnePublication);
router.get('/', auth, publicationCtrl.getAllPublications);

router.get('/likes/:publicationId', auth, publicationCtrl.getAllLikesOfOnePublication);

router.post('/', auth, multerPublications, publicationCtrl.createPublication);
router.post('/likes', auth, publicationCtrl.addOneLikeToggle);

router.delete('/:id', auth, publicationCtrl.deleteOnePublication);

module.exports = router;