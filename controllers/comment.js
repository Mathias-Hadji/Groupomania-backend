const { sequelize, Comment, User } = require('../models');
const jwt = require('jsonwebtoken');


exports.createOneComment = (req, res, next) => {

    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.USER_TOKEN);
    const userId = decodedToken.userId;

    Comment.create({ user_id_comment: userId, publication_id_comment: req.params.id, comment: req.body.comment })
    .then(() => res.status(201).json({ message: 'Commentaire créé avec succès !'}))
    .catch(err => res.status(401).json({ err }));
}


exports.getAllCommentsOfOnePublication = (req, res, next) => {

    Comment.findAll({ where: { publication_id_comment: req.params.id },
        include: {
            model: User,
            attributes: ['first_name_user', 'last_name_user', 'profile_pic_user', 'createdAt', 'updatedAt']
        } 
    })
    .then(comments => res.status(200).json(comments))
    .catch(err => res.status(401).json({ err }));

}


exports.getOneComment = (req, res, next) => {

    Comment.findOne({ where: { id: req.params.id } })
    .then(comment => res.status(200).json(comment))
    .catch(err => res.status(401).json({ err }));
}


exports.deleteOneComment = (req, res, next) => {

    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.USER_TOKEN);
    const userId = decodedToken.userId;

    Comment.findOne({ where: { id: req.params.id, user_id_comment: userId } })
    .then(comment => {

        if(!comment){
            res.status(401).json({ message: 'Suppression non autorisée.' })
        } else {

            Comment.destroy({ where: { id: req.params.id } })
            .then(() => res.status(201).json({ message: 'Commentaire supprimé avec succès !'}))
            .catch(err => res.status(401).json({ err }));
        }
    })
    .catch(err => res.status(500).json({ err }))
}