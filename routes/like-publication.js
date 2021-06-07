const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const likePublicationCtrl = require('../controllers/like-publication');

router.get('/publication/:id', auth, likePublicationCtrl.getAllLikesOfOnePublication);
router.get('/user/:id', auth, likePublicationCtrl.getAllLikesOfOneUser);

router.post('/publication/:id', auth, likePublicationCtrl.addOneLikeToggle);

module.exports = router;