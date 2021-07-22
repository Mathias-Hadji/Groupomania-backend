const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, `images/users/id-${req.params.id}/profile/profile-pic`);
    },
    filename: (req, file, callback) => {
        callback(null, 'profile-pic' + '.' + 'jpg');
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {

        if(MIME_TYPES[file.mimetype] !== 'jpg' && MIME_TYPES[file.mimetype] !== 'png'){
            callback(new Error('Format de fichier non autorisé : seules les images sont autorisées.'));
        }
        callback(null, true);
    }
});

module.exports = upload.single('image');