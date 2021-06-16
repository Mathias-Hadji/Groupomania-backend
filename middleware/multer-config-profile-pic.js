const multer = require('multer');
const jwt = require('jsonwebtoken');

const storage = multer.diskStorage({
    destination: (req, file, callback) => {

        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.USER_TOKEN);
        const userId = decodedToken.userId;

        callback(null, `images/users/id-${userId}/profile/profile-pic`);
    },
    filename: (req, file, callback) => {
        callback(null, 'profile-pic' + '.jpg');
    }
})

module.exports = multer({ storage: storage }).single('image');