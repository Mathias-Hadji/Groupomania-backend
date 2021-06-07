const { sequelize, Publication, User } = require('../models');
const jwt = require('jsonwebtoken');



exports.createPublication = (req, res, next) => {

    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.USER_TOKEN);
    const userId = decodedToken.userId;

    if(!req.file){

        Publication.create({ user_id_publication: userId, message_publication: req.body.message })
        .then(() => res.status(201).json({ message: 'Publication créée avec succès !'}))
        .catch(err => res.status(401).json({ err }));

    } else {

        const imageUrl = `${req.protocol}://${req.get('host')}/images/users/id-${userId}/publications/${req.file.filename}`

        Publication.create({ user_id_publication: userId, message_publication: req.body.message, image_publication: imageUrl })
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
    Publication.findAll(
        { include: {
            model: User,
            attributes: ['first_name_user', 'last_name_user', 'profile_pic_user', 'createdAt', 'updatedAt']
        } 
    })
    .then(publications => res.status(200).json(publications))
    .catch(err => res.status(401).json({ err }))
}


exports.deleteOnePublication = (req, res, next) => {
    Publication.destroy({ where: { id: req.params.id } })
        .then(res.status(201).json({ message: 'Publication supprimée avec succès !' }))
        .catch(err => res.status(401).json({ err }))
}