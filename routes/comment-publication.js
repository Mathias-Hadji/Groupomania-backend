const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const commentPublicationCtrl = require('../controllers/comment-publication');

// PUBLICATION ROUTES

router.get('/', auth, commentPublicationCtrl.getAllComments);
router.get('/:publicationId', auth, commentPublicationCtrl.getAllCommentsOfOnePublication);
router.post('/:publicationId', auth, commentPublicationCtrl.createOneComment);
router.delete('/:id', auth, commentPublicationCtrl.deleteOneComment);

module.exports = router;

