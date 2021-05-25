const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const likePublicationCtrl = require('../controllers/like-publication');

router.get('/:publicationId', auth, likePublicationCtrl.getLikesOfOnePublication);
router.post('/:publicationId', auth, likePublicationCtrl.likePublication);


router.get('/user/:userId', auth, likePublicationCtrl.getPublicationsLikedByOneUser);

module.exports = router;

