const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "C0c@c0l@",
    database: "employee_db"
});

connection.connect(function(err){
    if (err) throw err;
});

module.export = connection;