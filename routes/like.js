const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const likeCtrl = require('../controllers/like');

router.get('/user/:id', auth, likeCtrl.getAllLikesOfOneUser);
router.get('/publication/:publicationId', auth, likeCtrl.getAllLikesOfOnePublication);

router.post('/', auth, likeCtrl.addOneLikeToggle);

module.exports = router;