const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const commentCtrl = require('../controllers/comment');

router.get('/publication/:id', auth, commentCtrl.getAllCommentsOfOnePublication);
router.get('/:id', auth, commentCtrl.getOneComment);

router.post('/publication', auth, commentCtrl.createOneComment);

router.delete('/:id', auth, commentCtrl.deleteOneComment);

module.exports = router;