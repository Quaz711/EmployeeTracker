const DB = require("./server");
const inquirer = require("inquirer");
require("console.table");
require("dotenv").config();
let db = new DB();

userPrompt = () => {
    inquirer.prompt ([
        {
            type: "list",
            name: "choices",
            message: "Please choose one of the following:",
            choices: ["View All Employees", "Add Employee", "Update Employee Role",
                        "View All Roles", "Add Role", "View All Departments",
                        "Add Department", "Quit"]
        }
    ]).then((answers) => {
        const {choices} = answers;
        if (choices === "View All Employees") {
            viewEmployees();
        }
        else if (choices === "Add Employee") {
            addEmployee();
        }
        else if (choices === "Update Employee Role") {
            updateRole();
        }
        else if (choices === "View All Roles") {
            viewRoles();
        }
        else if (choices === "Add Role") {
            addRole();
        }
        else if (choices === "View All Departments") {
            viewDepartments();
        }
        else if (choices === "Add Department") {
            addDepartment();
        }
        else {
            db.connection.end();
        };
    });
};

connectionComplete = () => {
    console.log("*=====================================================*");
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
    userPrompt();
};

connectionComplete();

viewEmployees = () => {
    const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.department_name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id;`
    console.log("Pulling up all employees.\n");
    db.connection.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        userPrompt();
    });
};

addEmployee = () => {
    inquirer.prompt([
        {
            type: "input",
            name: "first",
            message: "First name of employee: ",
            validate: addFirst => {
                if (addFirst) {
                    return true;
                }

                else {
                    console.log("Please enter a first name");
                    return false;
                }
            }
        },

        {
            type: "input",
            name: "last",
            message: "Last name of employee: ",
            validate: addLast => {
                if (addLast) {
                    return true;
                }

                else {
                    console.log("Please enter a last name");
                    return false;
                }
            }
        }
    ]).then(answer => {
        const params = [answer.first, answer.last]
        const roleSql = `SELECT role.id, role.title FROM role;`
        db.connection.query(roleSql, (err, data) => {
            if (err) throw err;
            const roles = data.map(({ id, title }) => ({ name: title, value: id }));
            inquirer.prompt([
                {
                    type: "list",
                    name: "role",
                    message: "Employee's role: ",
                    choices: roles
                }
            ]).then(roleChoice => {
                const role = roleChoice.role;
                params.push(role);
                const managerSql = `SELECT * FROM employee;`
                db.connection.query(managerSql, (err, data) => {
                    if (err) throw err;
                    const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));
                    inquirer.prompt([
                        {
                            type: "list",
                            name: "manager",
                            message: "Employee's manager: ",
                            choices: managers
                        }
                    ]).then(managerChoice => {
                        const manager = managerChoice.manager;
                        params.push(manager);
                        const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);`
                        db.connection.query(sql, params, (err, result) => {
                            if (err) throw err;
                            console.log("Employee has been added");
                            viewEmployees();
                        });
                    });
                });
            });
        });
    });
};

updateRole = () => {
    const employeeSql = `SELECT * FROM employee`;
    db.connection.query(employeeSql, (err, data) => {
        if (err) throw err;
        const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));
        inquirer.prompt([
            {
                type: "list",
                name: "name",
                message: "Employee to update: ",
                choices: employees
            }
        ]).then(empChoice => {
            const employee = empChoice.name;
            const params = [];
            params.push(employee);
            const roleSql = `SELECT * FROM role`;
            db.connection.query(roleSql, (err, data) => {
                if (err) throw err;
                const roles = data.map(({ id, title }) => ({ name: title, value: id }));
                inquirer.prompt([
                    {
                        type: "list",
                        name: "role",
                        message: "Employee's new role: ",
                        choices: roles
                    }
                ]).then(roleChoice => {
                    const role = roleChoice.role;
                    params.push(role);
                    let employee = params[0];
                    params[0] = role;
                    params[1] = employee;
                    const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
                    db.connection.query(sql, params, (err, result) => {
                        if (err) throw err;
                        console.log("Employee has been updated");
                        viewEmployees();
                    });
                });
            });
        });
    });
};

viewRoles = () => {
    const sql = `SELECT role.id, role.title FROM role;`
    console.log("Pulling up all roles.\n");
    db.connection.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        userPrompt();
    });
};

addRole = () => {
    inquirer.prompt([
        {
            type: "input",
            name: "role",
            message: "Role to add: ",
            validate: addRole => {
                if (addRole) {
                    return true;
                }

                else {
                    console.log("Please enter a role.");
                    return false;
                }
            }
        },

        {
            type: "input",
            name: "salary",
            message: "Salary for this role: ",
            validate: salary => {
                if (isNaN(salary)) {
                    console.log("Please enter a salary");
                    return false;
                }

                else {
                    return true;
                }
            }
        }
    ]).then(answer => {
        const params = [answer.role, answer.salary];
        const roleSql = `SELECT department_name, id FROM department;`
        db.connection.query(roleSql, (err, data) => {
            if (err) throw err;
            const dept = data.map(({ department_name, id}) => ({ name: department_name, value: id }));
            inquirer.prompt([
                {
                    type: "list",
                    name: "dept",
                    message: "Department belonging to this role: ",
                    choices: dept
                }
            ]).then(deptChoice => {
                const dept = deptChoice.dept;
                params.push(dept);
                const sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?);`
                db.connection.query(sql, params, (err, result) => {
                    if (err) throw err;
                    console.log("Added " + answer.role + " to roles");
                    viewRoles();
                });
            });
        });
    });
};

viewDepartments = () => {
    const sql = `SELECT department.id, department.department_name FROM department;`
    console.log("Pulling up all departments.\n");
    db.connection.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        userPrompt();
    });
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
        const sql = `INSERT INTO department (department_name) VALUES (?);`
        db.connection.query(sql, answer.addDepartmentPrompt, (err, result) => {
            if (err) throw err;
            console.log("Added" + answer.addDepartmentPrompt + "department.");
            viewDepartments();
        });
    });
};