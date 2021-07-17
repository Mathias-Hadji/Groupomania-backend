const { sequelize, Session, User } = require('../models');

exports.getOneSession = async (req, res, next) => {
    try {
        const session = await Session.findOne({ where: { token_auth : req.params.id } });
        res.status(200).json(session);
    } catch(err){
        return res.status(401).json('Requête non valide.');
    }
}



exports.createSession = async (req, res, next) => {
    try {
        const userId = req.body.userId;
        const token = req.body.token;

        const findSession = await Session.findOne({ where: { user_id_session: userId } });
        // Si aucune session n'a été ouverte pour cet utilisateur alors création de la session
        if(!findSession){
            await Session.create({ user_id_session: userId, token_auth: token });
            return res.status(201).json('Session créée !');

        // Si l'utilisateur possède déjà une session mais que son token est différent du nouveau token généré alors update du token
        } else if(findSession.token_auth !== token) {
            await Session.update({ token_auth : token }, { where: { user_id_session : userId } });
            return res.status(201).json('Session mise à jour !');

        // Sinon la session est toujours valable 
        } else {
            return res.status(200).json("Session toujours valable.");
        }

    } catch(err) {
        return res.status(401).json("Une erreur s'est produite.");
    };
}


exports.deleteSession = async (req, res, next) => {
    try {
        const userId = req.body.userId

        const user = await User.findOne({ where: { id: req.params.id } });
        if(user.id != userId && user.is_admin != 1){
            let e = new Error('Action non autorisée !');
            e.name = 'UnauthorizedError';
            throw e;
        }

        await Session.destroy({ where: { user_id_session: req.params.id } });
        res.status(201).json({ successMessage: 'Session supprimée' });

    } catch(err) {

        if(err.name === 'UnauthorizedError'){
            return res.status(401).json(err.message);
        }

        else {
            return res.status(401).json('Requête non valide.');
        }
    }
}