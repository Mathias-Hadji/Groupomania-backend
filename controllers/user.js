const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const { sequelize, User, Like_publication } = require('../models');

const createUserFolders = require('../middleware/createUserFolders');


exports.getOneUser = async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { id: req.params.id }, 
            attributes: ['first_name_user', 'last_name_user', 'email_user', 'profile_pic_user', 'bio_user', 'is_admin', 'createdAt', 'updatedAt']});
        return res.status(200).json(user);
        
    } catch(err) {
        return res.status(401).json('Requête non valide.');
    }
}

exports.registration = async (req, res, next) => {
    try {
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const email = req.body.email;
        const password = req.body.password;
        const profilePicByDefault = `${req.protocol}://${req.get('host')}/images/profile-pic-user-default/profile-user.svg`;

        const hash = await bcrypt.hash(password, 10)
        const objUser = {
            first_name_user: firstName,
            last_name_user: lastName,
            email_user: email,
            password_user: hash,
            profile_pic_user: profilePicByDefault,
        }
        const createUser = await User.create(objUser)
        createUserFolders(createUser)
        return res.status(201).json({ message: 'Utilisateur enregistré avec succès !' })

    } catch(err) {

        if(err.name === 'SequelizeValidationError'){
            return res.status(401).json('Champ(s) non valide(s).');
        }
        
        if(err.name === 'SequelizeUniqueConstraintError'){
            return res.status(401).json('Email déjà utilisé.');
        }
        
        else {
            return res.status(401).json('Requête non valide.');
        }
    }
};


exports.login = async (req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const user = await User.findOne({ where: { email_user: email } })
        if(!user){
            let e = new Error('Email incorrect.');
            e.name = 'EmailError';
            throw e;
        }
        
        const bcryptComparePassword = await bcrypt.compare(password, user.password_user)
        if(!bcryptComparePassword){
            let e = new Error('Mot de passe incorrect.');
            e.name = 'PasswordError';
            throw e;
        }

        return res.status(200).json({
            userId: user.id,
            token: jwt.sign (
                { userId: user.id },
                process.env.AUTH_TOKEN,
                { expiresIn: '24h' }
            ), 
            message: 'Connexion réussie !'
        });

    } catch(err){

        if(err.name === 'EmailError' || err.name === 'PasswordError'){
            return res.status(401).json(err.message);
        }

        else {
            res.status(401).json('Requête non valide.');
        }
    }
}


exports.modifyUserBio = async (req, res, next) => {
    try {
        const userId = req.body.userId;
        const bio = req.body.bioUser;

        const user = await User.findOne({ where: { id: req.params.id } })
        
        if(user.id != userId && user.is_admin != 1){
            let e = new Error('Action non autorisée !');
            e.name = 'UnauthorizedError';
            throw e;
        }

        if(bio.length == 0 || bio == ' '){
           await User.update({ bio_user: 'Aucune description.' }, { where: { id: req.params.id}})
           res.status(201).json({ successMessage: 'Bio modifiée avec succès !', bio: 'Aucune description.'});
        } 
        
        await User.update({ bio_user: bio }, { where: { id: req.params.id }})
        res.status(201).json({ successMessage: 'Bio modifiée avec succès !', bio: bio })

    } catch(err){

        if(err.name === 'UnauthorizedError'){
            return res.status(401).json(err.message);
        }

        if(err.parent.code === 'ER_DATA_TOO_LONG'){
            return res.status(401).json('La limite de 255 caractères a été dépassée.');
        }
        
        else {
            return res.status(401).json('Requête non valide.');
        }
    }
}


exports.modifyUserProfilePic = async (req, res, next) => {
    try {
        const userId = req.body.userId;
        const filename = `${req.protocol}://${req.get('host')}/images/users/id-${req.params.id}/profile/profile-pic/profile-pic.jpg`

        const user = await User.findOne({ where: { id: req.params.id } })

        if(user.id != userId && user.is_admin != 1){
            let e = new Error('Action non autorisée !');
            e.name = 'UnauthorizedError';
            throw e;
        }

        await User.update({ profile_pic_user: filename }, { where: { id: req.params.id } })
        res.status(201).json({ successMessage: 'Image de profil modifiée avec succès !', profilePic: filename})

    } catch(err) {

        if(err.name === 'UnauthorizedError'){
            return res.status(401).json(err.message);
        }

        else {
            return res.status(401).json('Requête non valide.');
        }
    }
}


exports.modifyUserPassword = async (req, res, next) => {

    try {
        const regexpPassword = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$', 'i');

        const userId = req.body.userId;
        const currentPassword = req.body.inputUserCurrentPassword;
        const newPassword = req.body.inputUserNewPassword;

        const user = await User.findOne({ where: { id: req.params.id } });

        if(user.id != userId && user.is_admin != 1){
            let e = new Error('Action non autorisée !');
            e.name = 'UnauthorizedError';
            throw e;
        }

        const bcryptComparePassword = await bcrypt.compare(currentPassword, user.password_user);
        if(!bcryptComparePassword){
            let e = new Error('Mot de passe actuel incorrect.');
            e.name = 'PasswordNotMatchError';
            throw e;
        }

        if(!regexpPassword.test(newPassword)){
            let e = new Error('Le nouveau mot de passe doit avoir une longueur minimale de 8 caractères, 1 lettre majuscule, 1 lettre minuscule, 1 chiffre, 1 caractère spécial.');
            e.name = 'PasswordTooLasyError';
            throw e;
        }

        const hash = await bcrypt.hash(newPassword, 10);

        User.update({ password_user: hash }, { where: { id: req.params.id }});
        res.status(201).json({ successMessage: 'Mot de passe modifié avec succès !'});

    } catch(err) {

        if(err.name === 'UnauthorizedError' || err.name === 'PasswordNotMatchError' || err.name === 'PasswordTooLasyError'){
            return res.status(401).json(err.message);
        }

        else {
            return res.status(401).json('Requête non valide.');
        }
    }
}

exports.deleteOneUserAccount = async (req, res, next) => {
    try {
        const userId = req.body.userId;
        const dir = `images/users/id-${req.params.id}`;

        const user = await User.findOne({ where: { id: req.params.id } });

        if(user.id != userId && user.is_admin != 1){
            let e = new Error('Action non autorisée !');
            e.name = 'UnauthorizedError';
            throw e;
        }

        await User.destroy({ where: { id: req.params.id } });

        fs.rmdirSync(dir, { recursive: true });
        console.log(`${dir} a été supprimé !`);
        res.status(201).json({ successMessage: 'Compte supprimé avec succès !' });

    } catch(err) {

        if(err.name === 'UnauthorizedError'){
            return res.status(401).json(err.message);
        }

        else {
            return res.status(401).json('Requête non valide.');
        }
    }
}


exports.getAllLikesOfOneUser = async (req, res, next) => {
    try {
        const likes = await Like_publication.findAll({ where: { user_id: req.params.id } });
        return res.status(200).json(likes);

    } catch(err){
        return res.status(401).json('Requête non valide.');
    }
}
