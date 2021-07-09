const { sequelize, Publication, User } = require('../models');
const fs = require('fs');

exports.createPublication = (req, res, next) => {

    if(!req.file){

        Publication.create({ user_id_publication: req.body.userId, message_publication: req.body.message })
        .then(() => res.status(201).json({ message: 'Publication créée avec succès !'}))
        .catch(err => res.status(401).json({ err }));

    } else {
        const imageUrl = `${req.protocol}://${req.get('host')}/images/users/id-${req.body.userId}/publications/${req.file.filename}`

        Publication.create({ user_id_publication: req.body.userId, message_publication: req.body.message || ' ', image_publication: imageUrl })
        .then(() => res.status(201).json({ message: 'Publication créée avec succès !'}))
        .catch(err => res.status(401).json({ err }));  
    }
}


exports.getOnePublication = (req, res, next) => {

    Publication.findOne({ where: { id: req.params.id },
        include: {
            model: User,
            attributes: ['first_name_user', 'last_name_user', 'profile_pic_user', 'createdAt', 'updatedAt']
        } 
    })
    .then(publication => res.status(200).json(publication))
    .catch(err => res.status(401).json({ err }))
}


exports.getAllPublications = (req, res, next) => {
    Publication.findAll({ 
        order: [['updatedAt', 'DESC']],
        include: {
            model: User,
            attributes: [
                'first_name_user', 'last_name_user', 'profile_pic_user', 'createdAt', 'updatedAt'
            ]
        }
    })
    .then(publications => res.status(200).json(publications))
    .catch(err => res.status(500).json({ err }))
}



exports.deleteOnePublication = (req, res, next) => {

    Publication.findOne({ where: { id: req.params.id } })
    .then(publication => {

        if(!publication){
            return res.status(401).json({ message: 'Publication non trouvée !' })
        }

        User.findOne({ where: { id: req.body.userId } })
        .then(user => {

            if(user.id != publication.user_id_publication && user.is_admin != 1){
                return res.status(401).json({ message: 'Action non autorisée !' })
            }

            // Delete publication contain file
            if(publication.image_publication){
                const filename = publication.image_publication.split('/publications/')[1];

                fs.unlink(`images/users/id-${req.body.userId}/publications/${filename}`, () => {
                    Publication.destroy({ where: { id: req.params.id } })
                    .then(() => res.status(201).json({ message: 'Publication supprimée avec succès !' }))
                    .catch(err => res.status(500).json({ err }))
                })
            
            // Delete publication contain text only
            } else {
                Publication.destroy({ where: { id: req.params.id } })
                .then(() => res.status(201).json({ message: 'Publication supprimée avec succès !' }))
                .catch(err => res.status(500).json({ err }))
            }
        })
        .catch(err => res.status(401).json({ err }))
    })
    .catch(err => res.status(500).json({ err }))
}


