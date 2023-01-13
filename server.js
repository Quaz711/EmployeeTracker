const mysql = require("mysql2");

class DB {
    constructor() {
        this.connection = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "G1tHubP@55w0rd",
            database: "employee_db"
        });
        
        this.connection.connect(function(err){
            if (err) throw err;
        });
    }
}

module.exports = DB;