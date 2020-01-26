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
var userID = mymodule.memberID;

exports.listMovie = function (req, res) {
    client.query('SELECT * FROM cinema_app.movies ORDER BY movie_id ASC', function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.render('User/home.ejs', { title: "Select Movies", data: result.rows, userID: req.params.member_id});
    });                        
};

exports.listGrocery = function (req, res) {

    client.query('SELECT productType , ProductPrice FROM cinema_app.product', function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.render('Movie/read.ejs', { title: "Select additional product", data: result.rows });
    });                        
};

exports.selectSession = function (req, res) { //distickli session bilgilerini al
    res.render('User/session.ejs', { title: "Select Session", userID: req.params.member_id, movie_id:req.params.movie_id});                   
};

exports.session = function(req,res){
    var userID= req.params.member_id;
    var movie_id=req.params.movie_id;
    var session = req.body.selectpicker;
    res.redirect('/user'+userID+'/buying'+movie_id+'/'+session);
}

exports.listSeat=function(req,res){

    var movie_id = req.params.movie_id;
    var session = req.params.session;
    var member_id = req.params.member_id;
    client.query('select * from cinema_app.seats seat inner join cinema_app.saloons saloon on seat.saloon_no=saloon.saloon_id where movie_no=$1 and saloonsession=$2 ORDER BY seat_id ASC',[movie_id,session], function(err,result){
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
       res.render('User/buying.ejs', { title: "TICKET SALES PAGE", data: result.rows, userID: member_id, movie_id: movie_id, session: session});
    });
};

exports.selectedSeat =function(req,res){

    var movie_id = req.params.movie_id;
    var session = req.params.session;
    var userID = req.params.member_id;
    var seat=req.body.seats;
    res.redirect('/user'+userID+'/buying'+movie_id+'/'+session+'/'+seat);   
};

exports.showTicket=function(req,res){

    var movie_id = req.params.movie_id;
    var session = req.params.session;
    var member_id = req.params.member_id;
    var seat=(req.params.seat).split(",");
    
    
    client.query('select * from cinema_app.showticket where member_id=$1 AND movie_id=$2 AND saloonsession=$3 AND seatname IN ($4,$5)',[member_id,movie_id,session,seat[0],seat[1]], function(err,result1){
        var totalprice =0;
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        for(var i = 0;i < result1.rows.length;i++) {
            totalprice = totalprice + result1.rows[i].price;
        }
       
        client.query('select * from cinema_app.showgrocery ',function(err,result2){
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            res.render('User/showticket.ejs', { title: "TICKET SHOW PAGE", data: result1.rows, data2: result2.rows, userID: member_id,movie_id:movie_id,session:session,seat:seat , price: totalprice});
    
        });
      });
    
};

exports.sell= function(req,res){
    var movie_id = req.params.movie_id;
    var session = req.params.session;
    var member_id = req.params.member_id;
    var seats=(req.params.seat).split(",");
    var price = req.body.total;

        for(var i = 0; i < seats.length;i++){
            client.query(`
            INSERT INTO cinema_app.tickets (saloon_no, seat_no, member_no, movie_no, ticketprice)
            SELECT saloon_no, seat_id, $3, $4, $5
            FROM cinema_app.seats
            WHERE seatname=$2 
                AND
                      saloon_no=(SELECT saloon_id 
                           FROM cinema_app.saloons
                           where movie_no=1 and saloonsession=$1)`
                           ,[session, seats[i], member_id, movie_id, price], function(err,result){
                            if (err) {
                                console.log(err);
                                res.status(400).send(err);
                            }
                            res.render('User/succesfullsell.ejs', { title: "SUCCESFULL", data: result.rows, userID: member_id});
            });
        }
  
    
    
  



}




