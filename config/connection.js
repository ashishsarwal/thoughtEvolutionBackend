var mysql = require('mysql2');

//  var con = mysql.createConnection({
//      host: 'localhost',
//      user: 'root',
//      password: 'Groot@3022!!',
//      database: 'thoughtevolution',
//      multipleStatements: true
//  });

// var con = mysql.createConnection({
//    host: '184.168.112.45',
//    user: 'asarwal',
//    password: 'Baha@3022!!',
//    database: 'building_management',
//    multipleStatements: true
// });


var pool = mysql.createPool({
    host: '184.168.112.45',
    user: 'asarwal',
    password: 'Baha@3022!!',
    database: 'building_management',
    connectionLimit: 10,
    multipleStatements: true
});

module.exports = pool;

// try{
//     console.log('creating sql connection...');
//     var con = mysql.createConnection({
//        host: 'mi3-ts110.a2hosting.com',
//        user: 'teahoste_asarwal',
//        password: 'jpJZ6PjfOlYs',
//        database: 'teahoste_thought_evolution',
//        multipleStatements: true,
//    });
//    console.log('creating sql connection complete...');
  
//  }
//  catch(err){
//     console.log('sql error connection: ' + err.message);
//  }
//  module.exports = con;


