const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const userCtrl = require('../controllers/user');


// USER ROUTES
router.get('/:id', auth, userCtrl.getOneUser);
router.post('/registration', userCtrl.registration);
router.post('/login', userCtrl.login);
router.delete('/:id', userCtrl.deleteUserAccount);


module.exports = router;