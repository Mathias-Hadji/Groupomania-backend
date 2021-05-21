const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const userCtrl = require('../controllers/user');
const multerProfilePic = require('../middleware/multer-config-profile-pic');
const userDescriptionCtrl = require('../controllers/user-description');
const userProfilePicCtrl = require('../controllers/user-profile-pic');
const userPasswordCtrl = require('../controllers/user-password');

// USER ROUTES
router.get('/:id', auth, userCtrl.getOneUser);
router.get('/', auth, userCtrl.getAllUsers);

router.post('/registration', userCtrl.registration);
router.post('/login', userCtrl.login);

router.put('/password/:id', auth, userPasswordCtrl);
router.put('/description/:id', auth, userDescriptionCtrl);
router.put('/profile-pic/:id', auth, multerProfilePic, userProfilePicCtrl);

router.delete('/:id', auth, userCtrl.deleteUserAccount);

module.exports = router;