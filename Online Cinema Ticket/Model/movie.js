const { Client } = require('pg');
const client = new Client({
    "user": "postgres",
    "password" : "fatma",
    "host" : "localhost",
    "port" : 5432,
    "database" : "Cinema"
});
client.connect();

var mymodule = require('./login.js');
var adminID = mymodule.memberID;

exports.list = function (req, res) {
    client.query('SELECT * FROM cinema_app.movies ORDER BY movie_id ASC', function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.render('Movie/read.ejs', { title: "Movies", data: result.rows });
    });                            

};

exports.insert= function (req, res) {
    res.render('Movie/insert.ejs', { title: "Insert Movie" });
};              

exports.save = function (req, res) {

    var insertData = [req.body.moviename, req.body.duration, req.body.points, req.body.movietype, req.body.description];
    client.query('CALL cinema_app.insert_movie($1,$2,$3,$4,$5)', insertData, function (err, result) {
        if (err) {
            console.log("Error Saving : %s ", err);
        }
        res.redirect('/admin/movies');
    });

};

exports.updateSelect = function (req, res) {

    var movie_id = req.params.movie_id;

    client.query('SELECT * FROM cinema_app.movies WHERE movie_id=$1', [movie_id], function (err, result) {
        
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.render('Movie/update.ejs', { title: "Update Movie", data: result.rows });
    });         
};


exports.update = function (req, res) {
    
    var updateData = [req.body.moviename, req.body.duration, req.body.points, req.body.movietype, req.body.description, req.params.movie_id];
    client.query('UPDATE cinema_app.movies SET moviename=$1, duration=$2, points=$3, movietype=$4, description=$5  WHERE movie_id=$6', updateData, function (err, result) {
        if (err) {
            console.log("Error Updating : %s ", err);
        }
        res.redirect('/admin/movies');
    });

};

exports.delete = function (req, res) {

    var movie_id = req.params.movie_id;

    client.query("DELETE FROM cinema_app.movies WHERE movie_id=$1", [movie_id], function (err, rows) {
        if (err) {
            console.log("Error deleting : %s ", err);
        }
        res.redirect('/admin/movies');
    });

};


