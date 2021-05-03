const db = require('../config/dabatase');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');

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

            const profilePicDefaultUrl = `${req.protocol}://${req.get('host')}/images/profile-pic-user-default/profile-user.svg`

            const sql = `INSERT INTO Users VALUES (NULL, '${user.firstName}', '${user.lastName}', '${user.email}', '${user.password}', '${profilePicDefaultUrl}', DEFAULT, DEFAULT);`
            db.query(sql, function (err, result) {
              if (err) throw err;
              console.log("1 record inserted, ID: " + result.insertId);

              // Create directory images/users/user-ID
              fs.mkdir(`./images/users/id-${result.insertId}`, function(err) {
                if (err) {
                    console.log(err)
                } else {
                    console.log("New directory successfully created.")

                    // Create directory images/users/user-ID/profile
                    fs.mkdir(`./images/users/id-${result.insertId}/profile`, function(err) {
                        if (err) {
                            console.log(err)
                        } else {
                            console.log("New directory successfully created.")

                            // Create directory images/users/user-ID/profile/profile-pic
                            fs.mkdir(`./images/users/id-${result.insertId}/profile/profile-pic`, function(err) {
                                if (err) {
                                    console.log(err)
                                } else {
                                    console.log("New directory successfully created.")
                                }
                            })
                        }
                    })
                    // Create directory images/users/user-ID/publications
                    fs.mkdir(`./images/users/id-${result.insertId}/publications`, function(err) {
                        if (err) {
                            console.log(err)
                        } else {
                            console.log("New directory successfully created.")
                        }
                    }) 
                }
              })         
              res.status(201).json({ message: 'Compte créé !' });
            }); 
        })
        .catch(error => res.status(500).json({ error }));        
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
                return res.status(401).json({ error: 'Mot de passe incorrect' })
            }
            res.status(200).json({
                userId: user.id,
                token: jwt.sign(
                    { userId: user.id },
                    process.env.USER_TOKEN,
                    { expiresIn: '24h' }
                ),
                message:("Authentification réussie !")
            });
            
        })
        .catch(error => res.status(500).json({ error })); 
    });
}


exports.getOneUser = (req, res, next) => {

    const sql = `SELECT * FROM Users WHERE id='${req.params.id}';`
    db.query(sql, function (err, result, fields) {
        if (err) throw err;

        res.status(200).json({ result });
    });
}

exports.getAllUsers = (req, res, next) => {
    const sql = `SELECT * FROM Users;`
    db.query(sql, function (err, result, fields) {
        if(err) throw err;

        res.status(200).json({ result })
    })
}




exports.deleteUserAccount = (req, res, next) => {

    // directory path
    const dir = `images/users/id-${req.params.id}`;

    // delete directory recursively
    try {
        fs.rmdirSync(dir, { recursive: true });

        console.log(`${dir} is deleted!`);
    } catch (err) {
        console.error(`Error while deleting ${dir}.`);
    }

    const sql = `DELETE FROM Users WHERE id='${req.params.id}';`
    db.query(sql, function (err, result, fields) {
        if (err) throw err;

        res.status(200).json({ message: 'Compte supprimé !' });
    });
}