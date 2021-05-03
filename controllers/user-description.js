const db = require('../config/dabatase');


module.exports = (req, res, next) => {

    const sql = `UPDATE Users SET description_user = '${req.body.userDescription}' WHERE id=${req.params.id};`
    db.query(sql, function (err, result, fields) {
        if (err) throw err;

        res.status(201).json({ message: 'La description a bien été modifiée !' });
    });
}
