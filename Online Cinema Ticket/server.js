const express = require('express');
const bodyParser = require("body-parser");
const path = require('path');
var app = express();
var session = require('express-session');

var modelCeoPage = require('./Model/ceoPage.js');
var movies=require('./Model/movie.js');
var grocery=require('./Model/grocery.js');
var register=require('./Model/register.js'); 
var login=require('./Model/login.js'); 
var user=require('./Model/user.js'); 
var log=require('./Model/log.js');


app.set('views', path.join(__dirname, 'View'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'controller')));
app.use('/css',express.static(path.join(__dirname, '/View/css')));

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.get('/', login.login ); 
app.post('/',login.post); 

app.get('/register', register.create);
app.post('/register', register.save);

app.get('/movieLogList', log.movieLog);

app.get('/admin', modelCeoPage.ceoPage ); 

app.get('/admin/movies', movies.list);  
app.get('/admin/movies/insert', movies.insert);
app.post('/admin/movies/insert', movies.save);
app.get('/admin/movies/update/:movie_id', movies.updateSelect);
app.post('/admin/movies/update/:movie_id', movies.update);
app.get('/admin/movies/delete/:movie_id', movies.delete);

app.get('/admin/grocery', grocery.list);  
app.get('/admin/grocery/insert', grocery.insert);
app.post('/admin/grocery/insert', grocery.save);
app.get('/admin/grocery/update/:ptype', grocery.updateSelect);
app.post('/admin/grocery/update/:ptype', grocery.update);

app.get('/user:member_id',user.listMovie);
app.get('/user:member_id/buying:movie_id',user.selectSession);
app.post('/user:member_id/buying:movie_id', user.session);

app.get('/user:member_id/buying:movie_id/:session',user.listSeat);
app.post('/user:member_id/buying:movie_id/:session',user.selectedSeat);

app.get('/user:member_id/buying:movie_id/:session/:seat',user.showTicket);
app.post('/user:member_id/buying:movie_id/:session/:seat',user.sell);


app.listen(8080, function () {
    console.log('Server active on 8080 port...');
});