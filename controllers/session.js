const { sequelize, Session, User } = require('../models');
const jwt = require('jsonwebtoken');

exports.getOneSession = (req, res, next) => {

    Session.findOne({ where: { token_auth : req.params.id } })
        .then(session => res.status(200).json(session))
        .catch(err => res.status(401).json({ err }));
}


exports.createSession = (req, res, next) => {
    const userId = req.body.userId
    const token = req.body.token


    Session.findOne({ where: { user_id_session: userId } })
    .then(session => {

        if(!session){

            Session.create({ user_id_session: userId, token_auth: token })
            .then(() => res.status(201).json({ successMessage: 'Session créée'}))
            .catch(err => res.status(401).json({ err }))

        } else if(session.token_auth !== token ) {

            Session.update({ token_auth : token }, { where: { user_id_session : userId } })
            .then(() => res.status(200).json({ successMessage: 'Session mise à jour'}))
            .catch(err => res.status(401).json({ err }))
        } else {
            res.status(200).json({ successMessage: "Le token d'authentification est toujours valable" })
        }
    })
    .catch(err => res.status(401).json({ err }));
}


exports.deleteSession = (req, res, next) => {

    User.findOne({ where: { id: req.params.id } })
        .then(user => {

            if(user.id != req.body.userId && user.is_admin != 1){
                return res.status(401).json({ errorMessage: 'Action non autorisée !' }) 
            }
            
            Session.destroy({ where: { user_id_session: req.params.id } })
            .then(() => res.status(201).json({ successMessage: 'Session supprimée' }))
            .catch(err => res.status(401).json({ err }))
        })
        .catch(err => res.status(500).json({ err }))
}