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
            .then(res.status(201).json({ message: 'Compte créé avec succès !'}))
            .catch(err => res.status(400).json({ err }));

    })
    .catch(err => res.status(500).json({ err }));

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


exports.modifyUser = (req, res, next) => {

    const bio = req.body.bio;
    const currentPassword = req.body.currentPassword;
    const newPassword = req.body.newPassword;
    const file = req.file


    if(bio){

        User.update({ bio_user: bio }, { where: {id: req.params.id }})
            .then(() => res.status(201).json({ message: 'Bio modifiée avec succès !'}))
            .catch(err => res.status(401).json({ err }))

    } else if(currentPassword){

        User.findOne({ where: { id: req.params.id } })
            .then(user => {
                bcrypt.compare(currentPassword, user.password_user)
                .then(valid => {
                    if(!valid){
                        return res.status(401).json({ notValid: 'Le mot de passe que vous avez saisi est incorrect.' })
                    }

                    if(!regexpPassword.test(newPassword)){
                        return res.status(401).json({ notValid: 'Le mot de passe doit avoir une longueur minimale de 8 caractères, 1 lettre majuscule, 1 lettre minuscule, 1 chiffre, 1 caractère spécial.' })
                    }

                    bcrypt.hash(newPassword, 10)
                        .then(hash => {
                            User.update({ password_user: hash }, { where: { id: req.params.id }})
                            .then(() => res.status(201).json({ message: 'Mot de passe modifié avec succès !'}))
                            .catch(err => res.status(401).json({ err }))
                        })
                        .catch(err => res.status(401).json({ err }))
                })
                .catch(err => res.status(500).json({ err }))
            })
            .catch(err => res.status(500).json({ err }))

    } else if(file){   

        const imageUrl = `${req.protocol}://${req.get('host')}/images/users/id-${req.params.id}/profile/profile-pic/${req.file.filename}`

        User.update({ profile_pic_user : imageUrl }, { where: {id: req.params.id }})
            .then(() => res.status(201).json({ message: 'Image de profil modifiée avec succès !'}))
            .catch(err => res.status(401).json({ err }))

    } else {
        return res.status(500).json({message: 'Requête non valide'})
    }
}


exports.deleteOneUser = (req, res, next) => {

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
        .then(res.status(201).json({ message: 'Compte supprimé avec succès !' }))
        .catch(err => res.status(401).json({ err }))
}