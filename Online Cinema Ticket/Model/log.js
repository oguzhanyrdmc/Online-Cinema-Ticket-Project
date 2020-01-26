const { Client } = require('pg');
const client = new Client({
    "user": "postgres",
    "password" : "fatma",
    "host" : "localhost",
    "port" : 5432,
    "database" : "Cinema"
});
client.connect();


exports.movieLog = function (req, res) {
    client.query('SELECT * FROM cinema_app.movies_log', function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.render('Loggin/movieLog.ejs', { title: "Movie Loggin", data: result.rows });
    });                            

};