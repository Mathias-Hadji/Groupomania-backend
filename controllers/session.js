const { sequelize, Session, User } = require('../models');
const jwt = require('jsonwebtoken');


exports.createSession = (req, res, next) => {

    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.AUTH_TOKEN);
    const userId = decodedToken.userId;

    Session.findOne({ where: { user_id_session : userId } })
    .then(session => {

        if(!session){

            Session.create({ user_id_session: userId, token_auth: token })
            .then(() => res.status(201).json({ message: 'Session créée'}))
            .catch(err => res.status(401).json({ err }))

        } else if(session.token_auth !== token ) {

            Session.update({ token_auth : token }, { where: { user_id_session : userId } })
            .then(() => res.status(200).json({ message: 'Session mise à jour'}))
            .catch(err => res.status(401).json({ err }))
        } else {
            res.status(200).json({ message: "Le token d'authentification est toujours valable" })
        }
    })
    .catch(err => res.status(401).json({ err }));
}


exports.getOneSession = (req, res, next) => {

    Session.findOne({ where: { token_auth : req.params.id } })
    .then(session => res.status(200).json(session))
    .catch(err => res.status(401).json({ err }));
}


exports.deleteSession = (req, res, next) => {

    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.AUTH_TOKEN);
    const userId = decodedToken.userId;

    Session.destroy({ where: { user_id_session: userId } })
    .then(() => res.status(201).json({ message: 'Session supprimée' }))
    .catch(err => res.status(401).json({ err }))
}