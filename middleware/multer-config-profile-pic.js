const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, callback) => {

        callback(null, `images/users/id-${req.params.id}/profile/profile-pic`);
    },
    filename: (req, file, callback) => {
        callback(null, 'profile-pic' + '.jpg');
    }
})

module.exports = multer({ storage: storage }).single('image');