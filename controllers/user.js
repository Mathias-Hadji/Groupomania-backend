const db = require('../bdd/dabatase');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const firstNameValidator = require('../middleware/first-name-validator');
const lastNameValidator = require('../middleware/last-name-validator');
const emailValidator = require('../middleware/email-validator');
const passwordValidator = require('../middleware/password-validator');

exports.registration = (req, res, next) => {
    if(firstNameValidator.validate(req.body.firstName) == false){
        return res.status(401).json({error: 'Invalid first name'})
    }

    if(lastNameValidator.validate(req.body.lastName) == false){
        return res.status(401).json({error: 'Invalid last name'})
    }    

    if(emailValidator.validate(req.body.email) == false){
        return res.status(401).json({error: 'Invalid email'})
    }      

    if(passwordValidator.validate(req.body.password) == false){
        return res.status(401).json({error: 'Password must have minimum length 8, 1 uppercase letter, 1 lowercase letter, 1 digit, 1 special char.'})
    }

    const sql = `SELECT * FROM Users WHERE email_user = '${req.body.email}';`
    db.query(sql, function (err, result, fields) {
        if (err) throw err;

        const user = result[0]
        if(user){
            return res.status(401).json({ error: "L'email est déjà utilisé" })
        }
        bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: hash
            };
            const sql = `INSERT INTO Users VALUES (NULL, '${user.firstName}', '${user.lastName}', '${user.email}', '${user.password}', NULL, NULL, DEFAULT);`
            db.query(sql, function (err, result) {
              if (err) throw err;
              console.log("1 record inserted, ID: " + result.insertId);
              res.status(201).json({ message: 'Compte créé !' });
            });
        })
        .catch(error => res.status(500).json({error}));        
    });

};



exports.login = (req, res, next) => {    

    if(emailValidator.validate(req.body.email) == false){
        return res.status(401).json({error: 'Invalid email'})
    }      

    if(passwordValidator.validate(req.body.password) == false){
        return res.status(401).json({error: 'Password must have minimum length 8, 1 uppercase letter, 1 lowercase letter, 1 digit, 1 special char.'})
    }    
    
    const sql = `SELECT * FROM Users WHERE email_user='${req.body.email}';`
    db.query(sql, function (err, result, fields) {
        if (err) throw err;

        const user = result[0]
        if(!user){
            return res.status(401).json({ error: "Email ou mot de passe non valide" })
        }
        bcrypt.compare(req.body.password, user.password_user)
        .then(valid => {
            if(!valid){
                return res.status(401).json({error: 'Mot de passe incorrect'})
            }
            res.status(200).json({
                userId: user.id,
                token: jwt.sign(
                    { userId: user.id },
                    process.env.USER_TOKEN,
                    { expiresIn: '24h' }
                ),
                message:("Authentification réussie !"),
            });
            
        })
        .catch(error => res.status(500).json({error})); 
    });
}




exports.getOneUser = (req, res, next) => {

    const sql = `SELECT * FROM Users WHERE id='${req.params.id}';`
    db.query(sql, function (err, result, fields) {
        if (err) throw err;

        res.status(200).json({result});
    });
}


exports.deleteUserAccount = (req, res, next) => {
    const sql = `DELETE FROM Users WHERE id='${req.params.id}';`
    db.query(sql, function (err, result, fields) {
        if (err) throw err;

        res.status(200).json({message: 'Compte supprimé !'});
    });
}