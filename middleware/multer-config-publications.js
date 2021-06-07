const multer = require('multer');
const jwt = require('jsonwebtoken');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
}


const storage = multer.diskStorage({
    destination: (req, file, callback) => {

        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.USER_TOKEN);
        const userId = decodedToken.userId;

        callback(null, `images/users/id-${userId}/publications`);
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
})

module.exports = multer({ storage: storage }).single('image');