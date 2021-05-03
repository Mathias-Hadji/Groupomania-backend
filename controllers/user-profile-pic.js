const db = require('../config/dabatase');


module.exports = (req, res, next) => {

    if(!req.file){
        return res.status(401).json({notValid : 'Veuillez selectionner un fichier.'})
    }

    const sql = `SELECT * FROM Users WHERE id="${req.params.id}"`
    db.query(sql, function (err, result, fields) {
        if (err) throw err;
        const imageUrl = `${req.protocol}://${req.get('host')}/images/users/id-${req.params.id}/profile/profile-pic/${req.file.filename}`
        const sql = `UPDATE Users SET profile_pic_user = '${imageUrl}' WHERE id=${req.params.id};`
        db.query(sql, function (err, result) {
            if (err) throw err;
            console.log('Image de profil modifiée')
            res.status(201).json({ message: 'Image de profil modifiée !' });
        });
    });
}
