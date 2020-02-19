const { Client } = require('pg');
const client = new Client({
    "user": "postgres",
     "password" : "oguzhan",
    "host" : "localhost",
    "port" : 5432,
    "database" : "Cinema"
});
client.connect();

exports.create= function (req, res) {
    res.render('Register/register.ejs', { title: "Register"  });
};      

exports.save=function(req,res){
    
    var insertData = [req.body.first_name, req.body.last_name, req.body.email, req.body.phonenumber,req.body.mempassword, req.body.address, req.body.choosegender, req.body.Age];
    client.query('INSERT INTO cinema_app.members(first_name, last_name, email, phonenumber, mempassword,address,sex,age) VALUES($1,$2,$3,$4,$5,$6,$7,$8)', insertData,function(err,result) {
        if (err) {
            console.log("Error Saving : %s ", err);
        }
        res.redirect('/');    
    });

}
