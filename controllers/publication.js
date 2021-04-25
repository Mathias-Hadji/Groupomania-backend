const db = require('../config/dabatase');
const fs = require('fs')
const jwt = require('jsonwebtoken');
const textAreaValidator = require('../middleware/input-textarea-validator');

exports.createPublication = (req, res, next) => {

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
        const imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    
        const sql0 = `INSERT INTO Publications VALUES (NULL,${req.body.userId},'${req.body.message}','${imageUrl}', NOW());`
        
        db.query(sql0, function (err, result) {
            if (err) throw err;
            console.log("1 record inserted, ID: " + result.insertId);
            res.status(201).json({ message: 'Message publié !' });
        });
    }

};



exports.getAllPublications = (req, res, next) => {
    const sql = `SELECT 
    Users.first_name_user,
    Users.last_name_user,
    Users.profile_pic_user,
    Publications.id, 
    Publications.message_publication, 
    Publications.image_publication, 
    Publications.date_publication, 
    DATE_FORMAT(Publications.date_publication, '%d %b. %Y - %H:%i') AS date_publication_fr 
    FROM Users
    INNER JOIN Publications ON Users.id = user_id_publication;`
    db.query(sql, function (err, result, fields) {
        if (err) throw err;
        res.status(200).json(result)
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
            if(result[0].image_publiation){
                const filename = result[0].image_publication.split(`/images/`)[1];
                // Suppression de l'URL de l'image dans la database
                fs.unlink(`images/${filename}`, (err) => {
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



