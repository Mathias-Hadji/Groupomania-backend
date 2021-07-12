const { sequelize, Comment, User } = require('../models');


exports.createOneComment = (req, res, next) => {
    const comment = req.body.comment

    Comment.create({ user_id_comment: req.body.userId, publication_id_comment: req.body.publicationId, comment: req.body.comment })
    .then(() => res.status(201).json({ message: 'Commentaire créé avec succès !', comment: comment}))
    .catch(err => res.status(401).json({ err }));
}


exports.getAllCommentsOfOnePublication = (req, res, next) => {

    Comment.findAll({ where: { publication_id_comment: req.params.id },
        order: [['updatedAt', 'DESC']],
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

    Comment.findOne({ where: { id: req.params.id } })
    .then(comment => {
        if(!comment){
            return res.status(401).json({ message: 'Commentaire non trouvé !' })
        }

        User.findOne({ where: { id: req.body.userId } })
        .then(user => {
    
            if(user.id != comment.user_id_comment && user.is_admin != 1){
                return res.status(401).json({ message: 'Action non autorisée !' }) 
            }
    
            Comment.destroy({ where: { id: req.params.id } })
            .then(() => res.status(201).json({ message: 'Commentaire supprimé avec succès !'}))
            .catch(err => res.status(401).json({ err }));

        })
        .catch(err => res.status(500).json({ err }))
    })
    .catch(err => res.status(500).json({ err }))


}