const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multerProfilePic = require('../middleware/multer-config-profile-pic');

const userCtrl = require('../controllers/user');

// USER ROUTES
router.get('/:id', auth, userCtrl.getOneUser);
router.get('/', auth, userCtrl.getAllUsers);

router.post('/registration', userCtrl.registration);
router.post('/login', userCtrl.login);

router.put('/profile-pic/:id', auth, multerProfilePic, userCtrl.modifyUserProfilePic);
router.put('/bio/:id', auth, userCtrl.modifyUserBio);
router.put('/password/:id', auth, userCtrl.modifyUserPassword);

router.delete('/delete-account/:id', auth, userCtrl.deleteOneUserAccount);

module.exports = router;