const DB = require("./server"); //Loads the server.js file so we can pull the connection to the database
const inquirer = require("inquirer"); //Loads inquirer packages and modules
require("console.table"); //Loads console.table packages and modules
require("dotenv").config(); //Loads dotenv packages and modules
let db = new DB(); //Puts the database into a variable to be utilized later on

userPrompt = () => { //The initial menu for the user to select from
    inquirer.prompt ([ //Runs inquirer so user can make selections
        {
            type: "list", //The type of prompt
            name: "choices", //The name of the prompt
            message: "Please choose one of the following:", //The message the user sees for the prompt
            choices: ["View All Employees", "Add Employee", "Update Employee Role", //The choices the user has for the menu selection within the prompt
                        "View All Roles", "Add Role", "View All Departments",
                        "Add Department", "Quit"]
        }
    ]).then((answers) => { //After user selects a menu option we compare the user's choice to where we go to next
        const {choices} = answers; //Loads the user's choice into a different variable so we dont change the response on accident
        if (choices === "View All Employees") { //Checks to see if the user selected View All Employees
            viewEmployees(); //Goes to the viewEmployees function
        }
        else if (choices === "Add Employee") { //Checks to see if the user selected Add Employee
            addEmployee(); //Goes to the addEmployee function
        }
        else if (choices === "Update Employee Role") { //Checks to see if the user selected Update Employee Role
            updateRole(); //Goes to the updateRole function
        }
        else if (choices === "View All Roles") { //Checks to see if the user selected View All Roles
            viewRoles(); //Goes to the viewRoles function
        }
        else if (choices === "Add Role") { //Checks to see if the user selected Add Role
            addRole(); //Goes to the addRole function
        }
        else if (choices === "View All Departments") { //Checks to see if the user selected View All Departments
            viewDepartments(); //Goes to the viewDepartments function
        }
        else if (choices === "Add Department") { //Checks to see if the user selected Add Department
            addDepartment(); //Goes to the addDepartment function
        }
        else { //Any other choices not listed above
            db.connection.end(); //Ends the connection to the database
        };
    });
};

connectionComplete = () => { //Function that runs when we have connected to the database
    console.log("*=====================================================*"); //Fancy menu title
    console.log("|                                                     |");
    console.log("|    _____                 _                          |");
    console.log("|   |  ___|_ __ ___  _ __ | | ___  _   _  ___  ___    |");
    console.log("|   |  _| | '_ ' _ \\| '_ \\| |/ _ \\| | | |/ _ \\/ _ \\   |");
    console.log("|   | |___| | | | | | |_) | | (_) | |_| |  __/  __/   |");
    console.log("|   |_____|_| |_| |_| .__/|_|\\___/ \\__, |\\___|\\___|   |");
    console.log("|                   |_|            |___/              |");
    console.log("|    __  __                                           |");
    console.log("|   |  \\/  | __ _ _ __   __ _  __ _  ___ _ __         |");
    console.log("|   | |\\/| |/ _' | '_ \\ / _' |/ _' |/ _ \\ '__|        |");
    console.log("|   | |  | | (_) | | | | (_) | (_) |  __/ |           |");
    console.log("|   |_|  |_|\\__,_|_| |_|\\__,_|\\__, |\\___|_|           |");
    console.log("|                             |___/                   |");
    console.log("|                                                     |");
    console.log("*=====================================================*");
    userPrompt(); //Calls userPrompt function to get user's input for menu selection
};

connectionComplete(); //Calls the connectionComplete function when we have connected to the database

viewEmployees = () => { //Function that displays all the employees
    const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.department_name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id;` //mysql command to access the database
    console.log("Pulling up all employees.\n"); //Displays to the console to let user know what is going on
    db.connection.query(sql, (err, rows) => { //Runs the mysql command to the database and if all goes well it displays the data in the database
        if (err) throw err; //Displays an error if access to the database wasn't granted or we couldn't get the information correctly
        console.table(rows); //Displays the data from the database
        userPrompt(); //Calls userPrompt function to get user's input for menu selection
    });
};

addEmployee = () => { //Function that adds an employee
    inquirer.prompt([ //Runs inquirer so user can make selections
        {
            type: "input", //The type of prompt
            name: "first", //The name of the prompt
            message: "First name of employee: ", //The message the user sees for the prompt
            validate: addFirst => { //Checks to make sure the user entered something
                if (addFirst) { //If the user entered something valid
                    return true; //Returns true and continues
                }

                else { //If the user entered something invalid
                    console.log("Please enter a first name"); //Displays to the console that user needs to enter a valid response
                    return false; //Returns false and lets user try the input again for the prompt
                }
            }
        },

        {
            type: "input", //The type of prompt
            name: "last", //The name of the prompt
            message: "Last name of employee: ", //The message the user sees for the prompt
            validate: addLast => { //Checks to make sure the user entered something
                if (addLast) { //If the user entered something valid
                    return true; //Returns true and continues
                }

                else { //If the user entered something invalid
                    console.log("Please enter a last name"); //Displays to the console that user needs to enter a valid response
                    return false; //Returns false and lets user try the input again for the prompt
                }
            }
        }
    ]).then(answer => { //After user enter information we take the information and proceed further into more prompts
        const params = [answer.first, answer.last]; //Stores the user's respones into an array
        const roleSql = `SELECT role.id, role.title FROM role;` //mysql command to access the database
        db.connection.query(roleSql, (err, data) => { //Runs the mysql command to the database and if all goes well it displays the data in the database
            if (err) throw err; //Displays an error if access to the database wasn't granted or we couldn't get the information correctly
            const roles = data.map(({ id, title }) => ({ name: title, value: id })); //Variable that pulls all the roles available from the database
            inquirer.prompt([ //Runs inquirer so user can make selections
                {
                    type: "list", //The type of prompt
                    name: "role", //The name of the prompt
                    message: "Employee's role: ", //The message the user sees for the prompt
                    choices: roles //The choices the user has for the menu selection within the prompt
                }
            ]).then(roleChoice => { //After user enter information we take the information and proceed further into more prompts
                const role = roleChoice.role; //The role the user selected is stored as the sole role
                params.push(role); //The user's selected role is pushed into the database
                const managerSql = `SELECT * FROM employee;` //mysql command to access the database
                db.connection.query(managerSql, (err, data) => { //Runs the mysql command to the database and if all goes well it displays the data in the database
                    if (err) throw err; //Displays an error if access to the database wasn't granted or we couldn't get the information correctly
                    const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id })); //Variable that pulls all the managers available from the database
                    inquirer.prompt([ //Runs inquirer so user can make selections
                        {
                            type: "list", //The type of prompt
                            name: "manager", //The name of the prompt
                            message: "Employee's manager: ", //The message the user sees for the prompt
                            choices: managers //The choices the user has for the menu selection within the prompt
                        }
                    ]).then(managerChoice => { //After user enter information we take the information and proceed further into more prompts
                        const manager = managerChoice.manager; //The manager the user selected is stored as the sole manager
                        params.push(manager); //The user's selected manager is pushed into the database
                        const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);` //mysql command to access the database
                        db.connection.query(sql, params, (err, result) => { //Runs the mysql command to the database and if all goes well it displays the data in the database
                            if (err) throw err; //Displays an error if access to the database wasn't granted or we couldn't get the information correctly
                            console.log("Employee has been added"); //Displays to the console to let user know what is going on
                            viewEmployees(); //Goes to the viewEmployees function
                        });
                    });
                });
            });
        });
    });
};

updateRole = () => { //Function that updates an employee role
    const employeeSql = `SELECT * FROM employee;` //mysql command to access the database
    db.connection.query(employeeSql, (err, data) => { //Runs the mysql command to the database and if all goes well it displays the data in the database
        if (err) throw err; //Displays an error if access to the database wasn't granted or we couldn't get the information correctly
        const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id })); //Variable that pulls all the employees available from the database
        inquirer.prompt([ //Runs inquirer so user can make selections
            {
                type: "list", //The type of prompt
                name: "name", //The name of the prompt
                message: "Employee to update: ", //The message the user sees for the prompt
                choices: employees //The choices the user has for the menu selection within the prompt
            }
        ]).then(empChoice => { //After user enter information we take the information and proceed further into more prompts
            const employee = empChoice.name; //The employee the user selected is stored as the sole employee
            const params = []; //The parmas array is cleared out
            params.push(employee); //The user's selected employee is pushed into the database
            const roleSql = `SELECT * FROM role;` //mysql command to access the database
            db.connection.query(roleSql, (err, data) => { //Runs the mysql command to the database and if all goes well it displays the data in the database
                if (err) throw err; //Displays an error if access to the database wasn't granted or we couldn't get the information correctly
                const roles = data.map(({ id, title }) => ({ name: title, value: id })); //Variable that pulls all the roles available from the database
                inquirer.prompt([ //Runs inquirer so user can make selections
                    {
                        type: "list", //The type of prompt
                        name: "role", //The name of the prompt
                        message: "Employee's new role: ", //The message the user sees for the prompt
                        choices: roles //The choices the user has for the menu selection within the prompt
                    }
                ]).then(roleChoice => { //After user enter information we take the information and proceed further into more prompts
                    const role = roleChoice.role; //The role the user selected is stored as the sole role
                    params.push(role); //The user's selected role is pushed into the database
                    let employee = params[0]; //Array that will store the new employees information
                    params[0] = role; //Adding the employee's new role into the array
                    params[1] = employee; //Adding the rest of the employee's information into the array
                    const sql = `UPDATE employee SET role_id = ? WHERE id = ?;` //mysql command to access the database
                    db.connection.query(sql, params, (err, result) => { //Runs the mysql command to the database and if all goes well it displays the data in the database
                        if (err) throw err; //Displays an error if access to the database wasn't granted or we couldn't get the information correctly
                        console.log("Employee has been updated"); //Displays to the console to let user know what is going on
                        viewEmployees(); //Goes to the viewEmployees function
                    });
                });
            });
        });
    });
};

viewRoles = () => { //Function that views roles
    const sql = `SELECT role.id, role.title FROM role;` //mysql command to access the database
    console.log("Pulling up all roles.\n"); //Displays to the console to let user know what is going on
    db.connection.query(sql, (err, rows) => { //Runs the mysql command to the database and if all goes well it displays the data in the database
        if (err) throw err; //Displays an error if access to the database wasn't granted or we couldn't get the information correctly
        console.table(rows); //Displays the data from the database
        userPrompt(); //Calls userPrompt function to get user's input for menu selection
    });
};

addRole = () => { //Function that adds roles
    inquirer.prompt([ //Runs inquirer so user can make selections
        {
            type: "input", //The type of prompt
            name: "role", //The name of the prompt
            message: "Role to add: ", //The message the user sees for the prompt
            validate: addRole => { //Checks to make sure the user entered something
                if (addRole) { //If the user entered something valid
                    return true; //Returns true and continues
                }

                else { //If the user entered something invalid
                    console.log("Please enter a role."); //Displays to the console that user needs to enter a valid response
                    return false; //Returns false and lets user try the input again for the prompt
                }
            }
        },

        {
            type: "input", //The type of prompt
            name: "salary", //The name of the prompt
            message: "Salary for this role: ", //The message the user sees for the prompt
            validate: salary => { //Checks to make sure the user entered something
                if (isNaN(salary)) { //If the user entered something invalid
                    console.log("Please enter a salary"); //Displays to the console that user needs to enter a valid response
                    return false; //Returns false and lets user try the input again for the prompt
                }

                else { //If the user entered something valid
                    return true; //Returns true and continues
                }
            }
        }
    ]).then(answer => { //After user enter information we take the information and proceed further into more prompts
        const params = [answer.role, answer.salary]; //Stores the user's respones into an array
        const roleSql = `SELECT department_name, id FROM department;` //mysql command to access the database
        db.connection.query(roleSql, (err, data) => { //Runs the mysql command to the database and if all goes well it displays the data in the database
            if (err) throw err; //Displays an error if access to the database wasn't granted or we couldn't get the information correctly
            const dept = data.map(({ department_name, id}) => ({ name: department_name, value: id })); //Variable that pulls all the departments available from the database
            inquirer.prompt([ //Runs inquirer so user can make selections
                {
                    type: "list", //The type of prompt
                    name: "dept", //The name of the prompt
                    message: "Department belonging to this role: ", //The message the user sees for the prompt
                    choices: dept //The choices the user has for the menu selection within the prompt
                }
            ]).then(deptChoice => { //After user enter information we take the information and proceed further into more prompts
                const dept = deptChoice.dept; //The department the user selected is stored as the sole department
                params.push(dept); //The user's selected department is pushed into the database
                const sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?);` //mysql command to access the database
                db.connection.query(sql, params, (err, result) => { //Runs the mysql command to the database and if all goes well it displays the data in the database
                    if (err) throw err; //Displays an error if access to the database wasn't granted or we couldn't get the information correctly
                    console.log("Added " + answer.role + " to roles"); //Displays to the console to let user know what is going on
                    viewRoles(); //Goes to the viewRoles function
                });
            });
        });
    });
};

viewDepartments = () => { //Function that views departments
    const sql = `SELECT department.id, department.department_name FROM department;` //mysql command to access the database
    console.log("Pulling up all departments.\n"); //Displays to the console to let user know what is going on
    db.connection.query(sql, (err, rows) => { //Runs the mysql command to the database and if all goes well it displays the data in the database
        if (err) throw err; //Displays an error if access to the database wasn't granted or we couldn't get the information correctly
        console.table(rows); //Displays the data from the database
        userPrompt(); //Calls userPrompt function to get user's input for menu selection
    });
};

addDepartment = () => { //Function that adds departments
    inquirer.prompt([ //Runs inquirer so user can make selections
        {
            type: "input", //The type of prompt
            name: "addDepartmentPrompt", //The name of the prompt
            message: "Department to add: ", //The message the user sees for the prompt
            validate: addDepartmentPrompt => { //Checks to make sure the user entered something
                if(addDepartmentPrompt) { //If the user entered something valid
                    return true; //Returns true and continues
                }
                else { //If the user entered something invalid
                    console.log("Enter a valid department."); //Displays to the console that user needs to enter a valid response
                    return false; //Returns false and lets user try the input again for the prompt
                }
            }
        }
    ]).then(answer => { //After user enter information we take the information and proceed further into more prompts
        const sql = `INSERT INTO department (department_name) VALUES (?);` //mysql command to access the database
        db.connection.query(sql, answer.addDepartmentPrompt, (err, result) => { //Runs the mysql command to the database and if all goes well it displays the data in the database
            if (err) throw err; //Displays an error if access to the database wasn't granted or we couldn't get the information correctly
            console.log("Added" + answer.addDepartmentPrompt + "department."); //Displays to the console to let user know what is going on
            viewDepartments(); //Goes to the viewDepartments function
        });
    });
};