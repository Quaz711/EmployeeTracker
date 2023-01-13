const mysql = require("mysql2"); //Loads mysql2 packages and modules

class DB { //Creates a class for the database connection
    constructor() { //Builds a constructor for the DB class
        this.connection = mysql.createConnection({ //Creates a connection for the database through mysql
            host: "localhost", //Uses the localhost as the host
            user: "root", //Uses the root as the user
            password: "G1tHubP@55w0rd", //Mysql password for the root user
            database: "employee_db" //Name of the database we are loading
        });
        
        this.connection.connect(function(err){ //If there is an error connecting to the database an error is thrown
            if (err) throw err; //Throws the error to the console
        });
    }
}

module.exports = DB; //Exports the databse class to be utilzed elsewhere