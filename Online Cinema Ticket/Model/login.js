const { Client } = require('pg');
const client = new Client({
    "user": "postgres",
     "password" : "oguzhan",
    "host" : "localhost",
    "port" : 5432,
    "database" : "Cinema"
});
client.connect();



exports.login=function(req,res){
    res.render('Register/login.ejs', { title: "Login"  });
};

exports.post=function(req, res) {
	var email = req.body.email;
    var password = req.body.password;

		client.query('SELECT * FROM cinema_app.members WHERE email=$1 AND mempassword=$2', [email, password], function(err, results) {
           
            if (results.rowCount > 0) {
				req.session.loggedin = true;
                req.session.email = email;
                exports.memberID = results.rows[0].member_id;   
                          
                if(results.rows[0].membertype == 'Ceo'){
                    res.redirect('/admin');
                }else{
                    res.redirect('/user'+results.rows[0].member_id);
                }
				
			} else {
				res.send('Incorrect email and/or Password!');
			}			
			res.end();
		});
};





exports.get=function(req,res){
    if(req.session.email) {
        res.write(`<h1>Welcome ${req.session.email} </h1><br>`);
        res.end('<a href='+'/logout'+'>Logout</a>');
    }
    else {
        res.write('<h1>Please login first.</h1>');
        res.end('<a href='+'/login'+'>Login</a>');
    }
};

exports.logout= function(req,res) {
    req.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
        res.redirect('/login');
    });

};

