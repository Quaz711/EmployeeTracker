const mysql = require("mysql2");
const inquirer = require("inquirer");
const consoleTable = require("console.table");
require("dotenv").config();
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    pasword: process.env.MYSQL_PASSWORD,
    database: "employee_db"
});
const userPrompt = () => {
    inquirer.prompt ([
        {
            tpye: "list",
            name: "choices",
            message: "Please choose one of the following:",
            choices: ["Add A Department", "Add A Role", "Add An Employee",
                        "Update A Department", "Update A Role", "Update An Employee",
                        "Delete A Department", "Delete A Role", "Delete An Employee",
                        "View Departments", "View Roles", "View Employees",
                        "Employees By Department", "Department Budgets", "Nothing"]
        }
    ]).then((answers) => {
        const {choices} = answers;
        if (choices === "Add A Department") {
            addDepartment();
        }
        else if (choices === "Add A Role") {
            addRole();
        }
        else if (choices === "Add An Employee") {
            addEmployee();
        }
        else if (choices === "Update A Department") {
            updateDepartment();
        }
        else if (choices === "Update A Role") {
            updateRole();
        }
        else if (choices === "Update An Employee") {
            updateEmployee();
        }
        else if (choices === "Delete A Department") {
            deleteDepartment();
        }
        else if (choices === "Delete A Role") {
            deleteRole();
        }
        else if (choices === "Delete An Employee") {
            deleteEmployee();
        }
        else if (choices === "View Departments") {
            viewDepartments();
        }
        else if (choices === "View Roles") {
            viewRoles();
        }
        else if (choices === "View Employees") {
            viewEmployees();
        }
        else if (choices === "Employees By Department") {
            employeeDepartment();
        }
        else if (choices === "Department Budgets") {
            departmentBudgets();
        }
        else {
            connection.end();
        };
    });
};

connection.connect(err => {
    if (err) throw err;
    console.log("Connected! Id: " + connection.threadId);
    connectionComplete();
});

connectionComplete = () => {
    console.log("################################");
    console.log("#                              #");
    console.log("#           Manager            #");
    console.log("#                              #");
    console.log("################################");
    userPrompt();
};

addDepartment = () => {
    inquirer.prompt([
        {
            type: "input",
            name: "addDepartmentPrompt",
            message: "Department to add: ",
            validate: addDepartmentPrompt => {
                if(addDepartmentPrompt) {
                    return true;
                }
                else {
                    console.log("Enter a valid department.");
                    return false;
                }
            }
        }
    ]).then(answer => {
        connection.query(sql, answer.addDepartmentPrompt, (err, result) => {
            if (err) throw err;
            console.log("Added" + answer.addDepartmentPrompt + "department.");
            viewDepartments();
        });
    });
};

viewDepartments = () => {
    console.log("Pulling up all departments.\n");
    connection.promise().query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        userPrompt();
    });
};

viewRoles = () => {
    console.log("Pulling up all roles.\n");
    connection.promise().query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        userPrompt();
    });
};

viewEmployees = () => {
    console.log("Pulling up all employees.\n");
    connection.promise().query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        userPrompt();
    });
};