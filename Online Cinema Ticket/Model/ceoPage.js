const { Client } = require('pg');
const client = new Client({
    "user": "postgres",
    "password" : "oguzhan",
    "host" : "localhost",
    "port" : 5432,
    "database" : "Cinema"
});
client.connect();

exports.ceoPage = function (req, res) {
    client.query('SELECT SUM(ticketprice) FROM cinema_app.tickets', function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.render('ceoPage/ceoPage.ejs', { title: 'Cinema Ceo Page',data: result.rows[0].sum});
    }); 
    
};
