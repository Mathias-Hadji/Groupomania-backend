const db = require('../config/dabatase');
const bcrypt = require('bcrypt');
const passwordValidator = require('../middleware/password-validator');

module.exports = (req, res, next) => {

    if(req.body.inputUserCurrentPassword.length == 0 || req.body.inputUserNewPassword == 0){
        return res.status(401).json({notValid : 'Champ(s) vide(s).'})
    }

    const sql = `SELECT * FROM Users WHERE id='${req.params.id}';`
    db.query(sql, function (err, result, fields) {
        if (err) throw err;

        const user = result[0]
        bcrypt.compare(req.body.inputUserCurrentPassword, user.password_user)
        .then(valid => {

            if(!valid){
                return res.status(401).json({ notValid: 'Le mot de passe que vous avez saisi est incorrect.' })
            }

            if(passwordValidator.validate(req.body.inputUserNewPassword) == false){
                return res.status(401).json({ notValid: 'Le nouveau mot de passe doit contenir au moins: 8 caractères, 1 lettre majuscule, 1 lettre minuscule, 1 chiffre, 1 caractère spécial.'})
            }

            bcrypt.hash(req.body.inputUserNewPassword, 10)
            .then(hash => {
                const sql = `UPDATE Users SET password_user = '${hash}' WHERE id=${req.params.id};`
                db.query(sql, function (err, result) {
                    if (err) throw err;
                    console.log('Mot de passe modifié')
                    res.status(201).json({ message: 'Mot de passe modifié !' });
                }); 

            })
            .catch(error => res.status(500).json({ error }));              
        })
        .catch(error => res.status(500).json({ error })); 
    });
}
