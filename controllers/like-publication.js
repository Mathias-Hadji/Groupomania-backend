const { sequelize, Like_publication } = require('../models');
const jwt = require('jsonwebtoken');


exports.getAllLikesOfOnePublication = (req, res, next) => {

    Like_publication.findAll({ where: { publication_id: req.params.id } })
    .then(likes => res.status(200).json(likes))
    .catch(err => res.status(401).json({ err }));
}

exports.getAllLikesOfOneUser = (req, res, next) => {

    Like_publication.findAll({ where: { user_id: req.params.id } })
    .then(likes => res.status(200).json(likes))
    .catch(err => res.status(401).json({ err }));
}


exports.addOneLikeToggle = (req, res, next) => {

    // Get All Likes of One User
    Like_publication.findOne({ where: { user_id: req.body.userId, publication_id: req.params.id } })
    .then(like => {

        if(!like){
            Like_publication.create({ user_id: req.body.userId, publication_id: req.params.id })
            .then(() => res.status(201).json({ message: 'Like ajouté avec succès !' }))
            .catch(err => res.status(401).json({ err }))

        } else {
            Like_publication.destroy({ where: { user_id: req.body.userId, publication_id: req.params.id } })
            .then(() => res.status(201).json({ message: 'Like retiré avec succès !' }))
            .catch(err => res.status(401).json({ err }))
        }
    })
    .catch((err) => res.status(500).json({ err }));

}


