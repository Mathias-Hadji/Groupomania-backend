const jwt = require('jsonwebtoken');

// Contrôle la validité du token d'authentification de l'utilisateur
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.USER_TOKEN);
        const userId = decodedToken.userId;

        if(req.body.userId && req.body.userId !== userId){
            throw 'Invalid user ID';
        } else {
            next();
        }
    } catch{
        res.status(401).json({ error: new Error('Invalid request !' )});
    }
};
