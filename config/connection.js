var mysql = require('mysql2');

 var con = mysql.createConnection({
     host: 'localhost',
     user: 'root',
     password: 'Groot@3022!!',
     database: 'thoughtevolution',
     multipleStatements: true
 });

//var con = mysql.createConnection({
//    host: '184.168.112.45',
//    user: 'asarwal',
//    password: 'Baha@3022!!',
//    database: 'thoughtevolutiont',
//    multipleStatements: true
//});

module.exports = con;