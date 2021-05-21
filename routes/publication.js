const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const publicationCtrl = require('../controllers/publication');

const multerPublications = require('../middleware/multer-config-publications');

// PUBLICATION ROUTES
router.get('/', auth, publicationCtrl.getAllPublications);
router.get('/:id', auth, publicationCtrl.getOnePublication);
router.post('/', auth, multerPublications, publicationCtrl.createPublication);
// router.put à créer
router.delete('/:id', auth, publicationCtrl.deletePublication);


router.get('/likes/user/:id', auth, publicationCtrl.getPublicationsLikedByOneUser);
router.get('/likes/:publicationId', auth, publicationCtrl.getLikesOfPublication);
router.post('/likes/:publicationId', auth, publicationCtrl.likePublication);
module.exports = router;

