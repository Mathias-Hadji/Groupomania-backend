const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const sessionCtrl = require('../controllers/session');

router.get('/:token', auth, sessionCtrl.getOneSession);

router.post('/', auth, sessionCtrl.createSession);
router.delete('/:id', auth, sessionCtrl.deleteSession);


module.exports = router;