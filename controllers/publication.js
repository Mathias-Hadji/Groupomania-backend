const { sequelize, Publication, User, Like_publication } = require('../models');
const fs = require('fs');

exports.getOnePublication = async (req, res, next) => {
    try {
        const publication = await Publication.findOne({ where: { id: req.params.id },
            include: {
                model: User,
                attributes: ['first_name_user', 'last_name_user', 'profile_pic_user', 'createdAt', 'updatedAt']
            } 
        })
        return res.status(200).json(publication);

    } catch(err){
        return res.status(401).json('Requête non valide.');
    }

}

exports.getAllPublications = async (req, res, next) => {
    try {
        const publications = await Publication.findAll({ 
            order: [['updatedAt', 'DESC']],
            include: {
                model: User,
                attributes: [
                    'first_name_user', 'last_name_user', 'profile_pic_user', 'createdAt', 'updatedAt'
                ]
            }
        })
        return res.status(200).json(publications);

    } catch(err) {
        return res.status(401).json('Requête non valide.');
    }
}


exports.createPublication = async (req, res, next) => {
    try {
        const userId = req.body.userId;
        const message = req.body.message;

        const user = await User.findOne({ where: { id: userId} })
        if(user.id != userId && user.is_admin != 1){
            let e = new Error('Action non autorisée !');
            e.name = 'UnauthorizedError';
            throw e;
        }

        if(!req.file){
            await Publication.create({ user_id_publication: userId, message_publication: message });
            res.status(201).json({ message: 'Publication créée avec succès !'});
    
        } else {
            const imageUrl = `${req.protocol}://${req.get('host')}/images/users/id-${userId}/publications/${req.file.filename}`
            await Publication.create({ user_id_publication: userId, message_publication: message || ' ', image_publication: imageUrl || ' ' })
            res.status(201).json({ message: 'Publication créée avec succès !'})
        }

    } catch(err) {

        if(err.name === 'UnauthorizedError'){
            return res.status(401).json(err.message);
        }

        else {
            return res.status(401).json('Requête non valide.');
        }
    }
}

exports.deleteOnePublication = async (req, res, next) => {
    try {
        const userId = req.body.userId;

        const user = await User.findOne({ where: { id: userId } })
        const publication = await Publication.findOne({ where: { id: req.params.id } })

        if(user.id != publication.user_id_publication && user.is_admin != 1){
            let e = new Error('Action non autorisée !');
            e.name = 'UnauthorizedError';
            throw e;
        }

        // Delete publication with file
        if(publication.image_publication){
            const filename = publication.image_publication.split('/publications/')[1];
            fs.unlink(`images/users/id-${userId}/publications/${filename}`, () => {});

            await Publication.destroy({ where: { id: req.params.id } });
            res.status(201).json({ message: 'Publication supprimée avec succès !' });

        // Delete publication contain text only
        } else {
            await Publication.destroy({ where: { id: req.params.id } });
            res.status(201).json({ message: 'Publication supprimée avec succès !' });
        }

    } catch(err){
        
        if(err.name === 'UnauthorizedError'){
            return res.status(401).json(err.message);
        }

        else {
            return res.status(401).json('Requête non valide.');
        }
    }
}


exports.getAllLikesOfOnePublication = async (req, res, next) => {
    try {
        const likes = await Like_publication.findAll({ where: { publication_id: req.params.publicationId } });
        return res.status(200).json(likes);

    } catch(err) {
        return res.status(401).json('Requête non valide.');
    }
}



exports.addOneLikeToggle = async (req, res, next) => {
    try {
        const like = await Like_publication.findOne({ where: { publication_id: req.body.publicationId, user_id: req.body.userId } });

        // Add like
        if(!like){
            await Like_publication.create({ user_id: req.body.userId, publication_id: req.body.publicationId });
            return res.status(201).json({ message: 'Like ajouté avec succès !' });

        // Remove Like
        } else {
            Like_publication.destroy({ where: { user_id: req.body.userId, publication_id: req.body.publicationId } });
            return res.status(201).json({ message: 'Like retiré avec succès !' });
        }
    } catch (err) {
        return res.status(401).json('Requête non valide.');
    }
}