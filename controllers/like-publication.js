const db = require('../config/dabatase');
const jwt = require('jsonwebtoken');

// LIKES

exports.getLikesOfOnePublication = (req, res, next) => {

    const sql = `
    SELECT * FROM LikesPublications WHERE publication_id = ${req.params.publicationId};
    `
    db.query(sql, function (err, result, fields) {
        if (err) throw err;
        res.status(200).json(result)
    });
};


exports.getPublicationsLikedByOneUser = (req, res, next) => {

    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.USER_TOKEN);
    const userId = decodedToken.userId;

    const sql = `
        SELECT publication_id FROM LikesPublications WHERE user_id = ${userId};
    `
    db.query(sql, function (err, result, fields) {
        if (err) throw err;
        res.status(200).json(result)
    });
}



exports.likePublication = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.USER_TOKEN);
    const userId = decodedToken.userId;

    const sql = `
    SELECT * FROM LikesPublications WHERE publication_id = ${req.params.publicationId} AND user_id = ${userId};
    `
    db.query(sql, function (err, result, fields) {
        if (err) throw err;

        if(req.body.like == 1){
            const sql = `
            INSERT INTO LikesPublications VALUES (NULL, ${userId}, ${req.params.publicationId});
            `
            db.query(sql, function (err, result, fields) {
                if (err) throw err;
                res.status(200).json({message: 'like ajouté'})
            });

        } else {
            const sql = `
            DELETE FROM LikesPublications WHERE publication_id = ${req.params.publicationId} AND user_id = ${userId};
            `
            db.query(sql, function (err, result, fields) {
                if (err) throw err;
                res.status(200).json({message: 'like retiré'})
            });
        }
    });
};
