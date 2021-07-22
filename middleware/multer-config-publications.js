const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
}

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, `images/users/id-${req.body.userId}/publications`);
    },

    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    },
})

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {

        if(MIME_TYPES[file.mimetype] !== 'jpg' && MIME_TYPES[file.mimetype] !== 'png' && MIME_TYPES[file.mimetype] !== 'gif'){
            callback(new Error('Format de fichier non autorisé : seules les images sont autorisées.'));
        }
        callback(null, true);
    }
})

module.exports = upload.single('image');
