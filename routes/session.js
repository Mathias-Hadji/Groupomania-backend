const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const sessionCtrl = require('../controllers/session');

router.get('/:id', auth, sessionCtrl.getOneSession);

router.post('/', auth, sessionCtrl.createSession);
router.delete('/', auth, sessionCtrl.deleteSession);


module.exports = router;