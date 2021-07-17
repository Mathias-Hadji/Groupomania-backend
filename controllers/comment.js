const { sequelize, Comment, User } = require('../models');


exports.createOneComment = async (req, res, next) => {
    try {
        const userId = req.body.userId
        const publicationId = req.body.publicationId
        const comment = req.body.comment
    
        await Comment.create({ user_id_comment: userId, publication_id_comment: publicationId, comment: comment });
        res.status(201).json({ message: 'Commentaire créé avec succès !', comment: comment});
    } catch (err){
        return res.status(401).json('Requête non valide.');
    }
}


exports.getAllCommentsOfOnePublication = async (req, res, next) => {
    try {
        const comments = await Comment.findAll({ where: { publication_id_comment: req.params.id },
            order: [['updatedAt', 'DESC']],
            include: {
                model: User,
                attributes: ['first_name_user', 'last_name_user', 'profile_pic_user', 'createdAt', 'updatedAt']
            } 
        });
        return res.status(200).json(comments);

    } catch(err) {
        return res.status(401).json('Requête non valide.');
    }
}


exports.getOneComment = async (req, res, next) => {
    try {
        const comment = await Comment.findOne({ where: { id: req.params.id } });
        return res.status(200).json(comment);

    } catch(err) {
        return res.status(401).json('Requête non valide.');
    }
}

exports.deleteOneComment = async (req, res, next) => {
    try {
        const userId = req.body.userId

        const comment = await Comment.findOne({ where: { id: req.params.id } });
        const user = await User.findOne({ where: { id: userId } });
    
        if(user.id != comment.user_id_comment && user.is_admin != 1){
            let e = new Error('Action non autorisée !');
            e.name = 'UnauthorizedError';
            throw e;
        }
        await Comment.destroy({ where: { id: req.params.id } });
        return res.status(201).json({ message: 'Commentaire supprimé avec succès !'});

    } catch(err){

        if(err.name === 'UnauthorizedError'){
            return res.status(401).json(err.message);
        }

        else {
            return res.status(401).json('Requête non valide.');
        }
    }
}