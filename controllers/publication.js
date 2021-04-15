const db = require('../bdd/dabatase');

exports.createPublication = (req, res, next) => {
    console.log(req.body)
    const sql = `INSERT INTO Publications VALUES (NULL, '${req.body.userId}', '${req.body.message}', 'http://image.jpg', '2021-04-03');`
    db.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 record inserted, ID: " + result.insertId);
      res.status(201).json({ message: 'Message publié !' });
    });
};


exports.getAllPublications = (req, res, next) => {
    const sql = `SELECT Users.first_name_user, Users.last_name_user, Publications.message_publication, Publications.image_publication, Publications.date_publication FROM Users INNER JOIN Publications ON Users.id = user_id_publication;`
    db.query(sql, function (err, result, fields) {
        if (err) throw err;
        res.status(200).json(result)
    });
};

exports.deletePublication = (req, res, next) => {
    const sql = `DELETE FROM Publication WHERE id='${req.params.id}';`
    db.query(sql, function (err, result, fields) {
        if (err) throw err;

        res.status(200).json({message: 'Publication supprimée !'});
    });
};

