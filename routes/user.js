const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const userCtrl = require('../controllers/user');

const multerProfilePic = require('../middleware/multer-config-profile-pic');

// USER ROUTES

router.get('/:id', auth, userCtrl.getOneUser);
router.get('/', auth, userCtrl.getAllUsers);

router.post('/registration', userCtrl.registration);
router.post('/login', userCtrl.login);

router.put('/:id', auth, multerProfilePic, userCtrl.modifyUser);

router.delete('/:id', auth, userCtrl.deleteOneUser);

module.exports = router;