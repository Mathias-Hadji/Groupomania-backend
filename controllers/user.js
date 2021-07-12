const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const { sequelize, User, Like_publication } = require('../models');

const createUserFolders = require('../middleware/createUserFolders');


const regexpPassword = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$', 'i');


exports.getOneUser = (req, res, next) => {

    User.findOne({ where: { id: req.params.id }, 
        attributes: ['first_name_user', 'last_name_user', 'email_user', 'profile_pic_user', 'bio_user', 'is_admin', 'createdAt', 'updatedAt']})
        .then(user => res.status(200).json(user))
        .catch(err => res.status(401).json({ err }))
}

exports.registration = (req, res, next) => {

    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;
    const profilePicByDefault = `${req.protocol}://${req.get('host')}/images/profile-pic-user-default/profile-user.svg`;

    User.findOne({ where: { email_user: email } })
    .then(user => {
        if(user){
            res.status(401).json({ alreadyUsed: 'Adresse email déjà utilisée.'})

        } else {

            if(!regexpPassword.test(password)){
                return res.status(401).json({ notValid: 'Le mot de passe doit avoir une longueur minimale de 8 caractères, 1 lettre majuscule, 1 lettre minuscule, 1 chiffre, 1 caractère spécial.' })
            }  
        
            bcrypt.hash(password, 10)
            .then(hash => {
                const user = {
                    first_name_user: firstName,
                    last_name_user: lastName,
                    email_user: email,
                    password_user: hash,
                    profile_pic_user: profilePicByDefault,
                }
                User.create(user)
                .then(newUser => {
                    createUserFolders(newUser)
                })
                .then(() => res.status(201).json({ message: 'Utilisateur enregistré avec succès !' }))
                .catch(err => res.status(400).json({ err }));
            })
            .catch(err => res.status(500).json({ err }));

        }
    })
};


exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ where: { email_user: email } })
        .then(user => {
            if(!user){
                return res.status(401).json({ notValid: 'Email ou mot de passe incorrect.'})
            }
            bcrypt.compare(password, user.password_user)
            .then(valid => {
                if(!valid){
                    return res.status(401).json({ notValid: 'Mot de passe incorrect.'})
                } else {
                    res.status(200).json({
                        userId: user.id,
                        token: jwt.sign(
                            { userId: user.id },
                            process.env.AUTH_TOKEN,
                            { expiresIn: '24h' }
                        ), 
                        message: 'Connexion réussie !'
                    });
                }
            })
            .catch(err => res.status(401).json({ err }))
        })
        .catch(err => res.status(500).json({ err }))
}

exports.modifyUserProfilePic = (req, res, next) => {
    User.findOne({ where: { id: req.params.id } })
    .then(user => {

        if(user.id != req.body.userId && user.is_admin != 1){
            return res.status(401).json({ errorMessage: 'Action non autorisée !' })
        }

        const filename = `${req.protocol}://${req.get('host')}/images/users/id-${req.params.id}/profile/profile-pic/profile-pic.jpg`

        User.update({ profile_pic_user: filename }, { where: { id: req.params.id } })
        .then(() => res.status(201).json({ successMessage: 'Image de profil modifiée avec succès !', profilePic: filename}))
        .catch(err => res.status(401).json({ err }))
    })
    .catch(err => res.status(500).json({ err }))
}

exports.modifyUserBio = (req, res, next) => {
    const userId = req.body.userId;
    const bio = req.body.bioUser;

    User.findOne({ where: { id: req.params.id } })
    .then(user => {

        if(req.params.id != userId && user.is_admin != 1){
            return res.status(401).json({ errorMessage: 'Action non autorisée !' })
        }

        if(bio.length == 0 || bio == ' '){
            User.update({ bio_user: 'Aucune description.' }, { where: { id: req.params.id}})
            .then(() => res.status(201).json({ successMessage: 'Bio modifiée avec succès !', bio: 'Aucune description.'}))
            .catch(err => res.status(401).json({ errorMessage: 'Erreur' }))
        } else {
            User.update({ bio_user: bio }, { where: { id: req.params.id }})
            .then(() => res.status(201).json({ successMessage: 'Bio modifiée avec succès !', bio: bio}))
            .catch(err => res.status(401).json({ errorMessage: 'Erreur' }))
        }
    })
    .catch(err => res.status(500).json({ err }))
}


exports.modifyUserPassword = (req, res, next) => {

    const currentPassword = req.body.inputUserCurrentPassword;
    const newPassword = req.body.inputUserNewPassword;

    User.findOne({ where: { id: req.params.id } })
    .then(user => {

        if(req.params.id != req.body.userId && user.is_admin != 1){
            return res.status(401).json({ errorMessage: 'Action non autorisée !' }) 
        }

        bcrypt.compare(currentPassword, user.password_user)
        .then(valid => {
            if(!valid){
                return res.status(401).json({ errorMessage : 'Le mot de passe que vous avez saisi est incorrect.' })
            }

            if(!regexpPassword.test(newPassword)){
                return res.status(401).json({ errorMessage : 'Le nouveau mot de passe doit avoir une longueur minimale de 8 caractères, 1 lettre majuscule, 1 lettre minuscule, 1 chiffre, 1 caractère spécial.' })
            }

            bcrypt.hash(newPassword, 10)
                .then(hash => {
                    User.update({ password_user: hash }, { where: { id: req.params.id }})
                    .then(() => res.status(201).json({ successMessage: 'Mot de passe modifié avec succès !'}))
                    .catch(err => res.status(401).json({ err }))
                })
                .catch(err => res.status(401).json({ err }))
        })
        .catch(err => res.status(401).json({ err }))
    })
    .catch(err => res.status(500).json({ err }))
}




exports.deleteOneUserAccount = (req, res, next) => {

    User.findOne({ where: { id: req.params.id } })
    .then(user => {

        if(user.id != req.body.userId && user.is_admin != 1){
            return res.status(401).json({ errorMessage: 'Action non autorisée !' }) 
        }

        User.destroy({ where: { id: req.params.id } })
        .then(() => {
            const dir = `images/users/id-${req.params.id}`;

            try {
                fs.rmdirSync(dir, { recursive: true });

                console.log(`${dir} a été supprimé !`);
            } catch (err) {
                console.error(`Erreur à la suppression de l'élément ${dir}.`);
            }
        })
        .then(() => res.status(201).json({ successMessage: 'Compte supprimé avec succès !' }))
        .catch(err => res.status(401).json({ err }))
    })
    .catch(err => res.status(500).json({ err }))
}


exports.getAllLikesOfOneUser = (req, res, next) => {

    Like_publication.findAll({ where: { user_id: req.params.id } })
    .then(likes => res.status(200).json(likes))
    .catch(err => res.status(401).json({ err }));
}
