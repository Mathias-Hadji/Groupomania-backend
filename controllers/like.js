const { sequelize, Like_publication } = require('../models');


exports.getAllLikesOfOneUser = async (req, res, next) => {
    try {
        const likes = await Like_publication.findAll({ where: { user_id: req.params.id } });
        return res.status(200).json(likes);

    } catch(err){
        return res.status(401).json('Requête non valide.');
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
        const userId = req.body.userId
        const publicationId = req.body.publicationId

        const like = await Like_publication.findOne({ where: { publication_id: publicationId, user_id: userId } });

        // Add like
        if(!like){
            await Like_publication.create({ user_id: userId, publication_id: publicationId });
            return res.status(201).json({ message: 'Like ajouté avec succès !' });

        // Remove Like
        } else {
            Like_publication.destroy({ where: { user_id: userId, publication_id: publicationId } });
            return res.status(201).json({ message: 'Like retiré avec succès !' });
        }
    } catch (err) {
        return res.status(401).json('Requête non valide.');
    }
}

