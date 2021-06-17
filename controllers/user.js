const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const { sequelize, User } = require('../models');

const createUserFolders = require('../middleware/createUserFolders');

const regexpPassword = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$', 'i');


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
        
            if(firstName.length < 1){
                return res.status(401).json({ notValid: 'Test' })
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
                            isAdmin: user.is_admin,
                            token: jwt.sign(
                                { userId: user.id, isAdmin: user.is_admin },
                                process.env.USER_TOKEN,
                                { expiresIn: '24h' }
                            ), message:('Connexion réussie !')
                        });
                    }
                })
                .catch(err => res.status(401).json({ err }))
        })
        .catch(err => res.status(500).json({ err }))
}


exports.getOneUser = (req, res, next) => {

    User.findOne({ where: { id: req.params.id }, 
        attributes: ['first_name_user', 'last_name_user', 'email_user', 'profile_pic_user', 'bio_user', 'createdAt', 'updatedAt']})
        .then(user => res.status(200).json(user))
        .catch(err => res.status(401).json({ err }))
}


exports.getAllUsers = (req, res, next) => {
    User.findAll({ attributes: ['first_name_user', 'last_name_user', 'email_user', 'profile_pic_user', 'bio_user', 'createdAt', 'updatedAt'] })
        .then(users => res.status(200).json(users))
        .catch(err => res.status(401).json({ err }))
}



exports.modifyUserProfilePic = (req, res, next) => {

    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.USER_TOKEN);
    const userId = decodedToken.userId;

    User.findOne({ where: { id: userId } })
    .then(user => {

        if(!user){
            res.status(401).json({ message: 'Modification non autorisée.'})
        } else {
            const filename = `${req.protocol}://${req.get('host')}/images/users/id-${userId}/profile/profile-pic/profile-pic.jpg`
        
            User.update({ profile_pic_user: filename }, { where: { id: userId } })
            .then(() => res.status(201).json({ message: 'Image de profil modifiée avec succès !'}))
            .catch(err => res.status(401).json({ err }))
        }
    })
    .catch(err => res.status(500).json({ err }))
}

exports.modifyUserBio = (req, res, next) => {

    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.USER_TOKEN);
    const userId = decodedToken.userId;

    const bio = req.body.bioUser;

    User.findOne({ where: { id: userId } })
    .then(user => {

        if(!user){
            res.status(401).json({ message: 'Modification non autorisée.'})
        
        } else {

            if(bio.length == 0 || bio == ' '){
                User.update({ bio_user: 'Aucune description.' }, { where: { id: userId}})
                .then(() => res.status(201).json({ message: 'Bio modifiée avec succès !'}))
                .catch(err => res.status(401).json({ notValid: 'Erreur' }))
            } else {
                User.update({ bio_user: bio }, { where: { id: userId }})
                .then(() => res.status(201).json({ message: 'Bio modifiée avec succès !'}))
                .catch(err => res.status(401).json({ notValid: 'Erreur' }))
            }
        }
    })
    .catch(err => res.status(500).json({ err }))


}


exports.modifyUserPassword = (req, res, next) => {
    
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.USER_TOKEN);
    const userId = decodedToken.userId;

    const currentPassword = req.body.inputUserCurrentPassword;
    const newPassword = req.body.inputUserNewPassword;

    User.findOne({ where: { id: userId } })
    .then(user => {

        if(!user){
            res.status(401).json({ message: 'Modification non autorisée.'})
        } else {

            bcrypt.compare(currentPassword, user.password_user)
            .then(valid => {
                if(!valid){
                    return res.status(401).json({ notValid: 'Le mot de passe que vous avez saisi est incorrect.' })
                }
    
                if(!regexpPassword.test(newPassword)){
                    return res.status(401).json({ notValid: 'Le nouveau mot de passe doit avoir une longueur minimale de 8 caractères, 1 lettre majuscule, 1 lettre minuscule, 1 chiffre, 1 caractère spécial.' })
                }
    
                bcrypt.hash(newPassword, 10)
                    .then(hash => {
                        User.update({ password_user: hash }, { where: { id: userId }})
                        .then(() => res.status(201).json({ message: 'Mot de passe modifié avec succès !'}))
                        .catch(err => res.status(401).json({ err }))
                    })
                    .catch(err => res.status(401).json({ err }))
            })
            .catch(err => res.status(500).json({ err }))
        }
    })
    .catch(err => res.status(500).json({ err }))

}




exports.deleteOneUserAccount = (req, res, next) => {

    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.USER_TOKEN);
    const userId = decodedToken.userId;

    User.findOne({ where: { id: userId } })
    .then(user => {
        if(!user){
            res.status(401).json({ message: 'Suppression non autorisée.'})
        } else {
            User.destroy({ where: { id: userId } })
            .then(() => {
                const dir = `images/users/id-${userId}`;
    
                try {
                    fs.rmdirSync(dir, { recursive: true });
    
                    console.log(`${dir} a été supprimé !`);
                } catch (err) {
                    console.error(`Erreur à la suppression de l'élément ${dir}.`);
                }
            })
            .then(() => res.status(201).json({ message: 'Compte supprimé avec succès !' }))
            .catch(err => res.status(401).json({ err }))
        }
    })


}