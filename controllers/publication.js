const db = require('../config/dabatase');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const textAreaValidator = require('../middleware/input-textarea-validator');

exports.createPublication = (req, res, next) => {

    if(req.body.message.length == 0 && !req.file){
        return res.status(401).json({notValid : 'Champ vide.'})
    }

    if(textAreaValidator.validate(req.body.message) == false){
        return res.status(401).json({error: 'Invalid text-area'})
    }

    if(!req.file){
        const sql = `INSERT INTO Publications VALUES (NULL,${req.body.userId},'${req.body.message}', '', NOW());`
        
        db.query(sql, function (err, result) {
            if (err) throw err;
            console.log("1 record inserted, ID: " + result.insertId);
            res.status(201).json({ message: 'Message publié !' });
        });
    } else {
        const imageUrl = `${req.protocol}://${req.get('host')}/images/users/id-${req.body.userId}/publications/${req.file.filename}`
    
        const sql0 = `INSERT INTO Publications VALUES (NULL,${req.body.userId},'${req.body.message}','${imageUrl}', NOW());`
        
        db.query(sql0, function (err, result) {
            if (err) throw err;
            console.log("1 record inserted, ID: " + result.insertId);
            res.status(201).json({ message: 'Message publié !' });
        });
    }

};



exports.getAllPublications = (req, res, next) => {
    const sql = `
    SELECT
    P.id,
    P.image_publication,
    P.message_publication,
    DATE_FORMAT(P.date_publication, '%d %b. %Y - %H:%i') AS date_publication_fr,
    U.first_name_user,
    U.last_name_user,
    U.profile_pic_user,
    (select count(LP.id) from LikesPublications as LP where LP.publication_id = P.id) as likes
    FROM Users AS U, Publications AS P
    WHERE P.user_id_publication = U.id;
    `
    
    db.query(sql, function (err, result, fields) {
        if (err) throw err;
        res.status(200).json(result) 
    });



};


exports.getOnePublication = (req, res, next) => {
    const sql = `
    SELECT
    P.id,
    P.image_publication,
    P.message_publication,
    DATE_FORMAT(P.date_publication, '%d %b. %Y - %H:%i') AS date_publication_fr,
    U.first_name_user,
    U.last_name_user,
    U.profile_pic_user,
    (select count(LP.id) from LikesPublications as LP where LP.publication_id = P.id) as likes
    FROM Users AS U, Publications AS P
    WHERE P.user_id_publication = U.id
    AND P.id = ${req.params.id};
    `

    db.query(sql, function (err, result, fields) {
        if (err) throw err;

        const sql = `
        SELECT
        C.*,
        U.first_name_user,
        U.last_name_user, 
        U.profile_pic_user,
        DATE_FORMAT(C.date_comment, '%d %b. %Y - %H:%i') AS date_comment_fr
        FROM Comments as C, Users as U
        WHERE C.publication_id = ${req.params.id}
        AND C.user_id = U.id;
        `
        db.query(sql, function (err, result2, fields) {
            if (err) throw err;


            const sql = `
            SELECT * FROM LikesPublications WHERE publication_id = ${req.params.id};
            `

            db.query(sql, function (err, result3, fields) {
                if (err) throw err;

                res.status(200).json({ publication: result, commentaires: result2, likes: result3 })
            });
        });
    });

};




exports.deletePublication = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.USER_TOKEN);
    const userId = decodedToken.userId;

    const sql = `SELECT * FROM Publications WHERE id=${req.params.id};`
    db.query(sql, function (err, result, fields) {
        if (err) throw err;

        const userIdPublication = result[0].user_id_publication

        if(userId != userIdPublication){
            console.log('Suppression non autorisée')
            res.status(401).json({ message: 'Suppression non autorisée' })

        } else {
            console.log('Suppression autorisée')
            if(result[0].image_publication){
                const filename = result[0].image_publication.split(`/publications/`)[1];

                fs.unlink(`images/users/id-${userId}/publications/${filename}`, (err) => {
                    if(err) console.log(err);
                    else{
                        db.query(`DELETE FROM Publications WHERE id=${req.params.id};` , function (err, result, fields) {
                            if (err) throw err;
                    
                            res.status(200).json({message: 'Publication supprimée !'});
                        }); 
                    }
                })
            } else {
                db.query(`DELETE FROM Publications WHERE id=${req.params.id};` , function (err, result, fields) {
                    if (err) throw err;
            
                    res.status(200).json({message: 'Publication supprimée !'});
                });                 
            }
        }
    });
    
};





// LIKES


exports.getLikesOfPublication = (req, res, next) => {

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
