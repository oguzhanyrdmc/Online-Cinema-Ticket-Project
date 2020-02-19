const { Client } = require('pg');
const client = new Client({
    "user": "postgres",
    "password" : "oguzhan",
    "host" : "localhost",
    "port" : 5432,
    "database" : "Cinema"
});
client.connect();

var mymodule = require('./login.js');
var adminID = mymodule.memberID;

exports.list = function (req, res) {
    client.query('SELECT ptype,price,stock FROM cinema_app.products', function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.render('Grocery/productList.ejs', { title: "Product List", data: result.rows });
    });                            
};

exports.insert= function (req, res) {
    res.render('Grocery/productAdd.ejs', { title: "Insert Product" });
};              

exports.save = function (req, res) {

    var insertData = [req.body.ptype, req.body.price, req.body.stock];
    client.query('INSERT INTO cinema_app.products( ptype, price, stock) VALUES ($1, $2, $3)', insertData, function (err, result) {
        if (err) {
            console.log("Error Saving : %s ", err);
        }
        res.redirect('/admin/grocery');
    });

};

exports.updateSelect = function (req, res) {

    var ptype = req.params.ptype;
    console.log(req.params);
    client.query('SELECT * FROM cinema_app.products WHERE ptype=$1', [ptype], function (err, result) {
        
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.render('Grocery/productUpdate.ejs', { title: "Update Product", data: result.rows });
    });         
};


exports.update = function (req, res) {
    
    var updateData = [req.body.ptype, req.body.price, req.body.stock, req.params.ptype];
    client.query('UPDATE cinema_app.products SET ptype=$1, price=$2, stock=$3 WHERE ptype=$4', updateData, function (err, result) {
        if (err) {
            console.log("Error Updating : %s ", err);
        }
        res.redirect('/admin/grocery');
    });

};


