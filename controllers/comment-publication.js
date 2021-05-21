const db = require('../config/dabatase');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const textAreaValidator = require('../middleware/input-textarea-validator');


// COMMENTS

exports.createOneComment = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.USER_TOKEN);
    const userId = decodedToken.userId;

    if(req.body.comment.length == 0){
        return res.status(401).json({notValid : 'Champ vide.'})
    }

    const sql = `
    INSERT INTO Comments VALUES (NULL, ${userId}, ${req.params.publicationId}, '${req.body.comment}', NOW());
    `
    db.query(sql, function (err, result, fields) {
        if (err) throw err;
        res.status(200).json({message: 'Commentaire publié !'})
    });
}




exports.getAllComments = (req, res, next) => {

    const sql = `
    SELECT * FROM Comments;
    `
    db.query(sql, function (err, result, fields) {
        if (err) throw err;
        res.status(200).json(result)
    });
}


exports.getAllCommentsOfOnePublication = (req, res, next) => {

    const sql = `
    SELECT
    C.*,
    U.first_name_user,
    U.last_name_user, 
    U.profile_pic_user,
    DATE_FORMAT(C.date_comment, '%d %b. %Y - %H:%i') AS date_comment_fr
    FROM Comments as C, Users as U
    WHERE C.publication_id = ${req.params.publicationId}
    AND C.user_id = U.id;
    `

    db.query(sql, function (err, result, fields) {
        if (err) throw err;
        res.status(200).json(result)
    });
}


exports.deleteOneComment = (req, res, next) => {

    const sql = `
    DELETE FROM Comments WHERE id=${req.params.id}
    `

    db.query(sql, function (err, result, fields) {
        if (err) throw err;
        res.status(200).json({message: 'Commentaire supprimé !'})
    });
}