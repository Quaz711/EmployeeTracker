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
            validate: addSalary => {
                if (isNaN(addSalary)) {
                    return true;
                }

                else {
                    console.log("Please ernter a salary");
                    return false;
                }
            }
        }
    ]).then(answer => {
        const params = [answer.role, answer.salary];
        const roleSql = `SELCET name, id FROM department`;
        connection.promise().query(roleSql, (err, data) => {
            if (err) throw err;
            const dept = data.map(({ name, id}) => ({ name: name, value: id }));
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
                const sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
                connection.query(sql, params, (err, result) => {
                    if (err) throw err;
                    console.log("Added " + answer.role + " to roles");
                    viewRoles();
                });
            });
        });
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
        const roleSql = `SELECT role.id, role.title FROM role`;
        connection.promise().query(roleSql, (err, data) => {
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
                const managerSql = `SELECT * FROM employee`;
                connection.promise().query(managerSql, (err, data) => {
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
                        const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES "(?, ?, ?, ?)`;
                        connection.query(sql, params, (err, result) => {
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

updateEmployee = () => {
    const employeeSql = `SELECT * FROM employee`;
    connection.promise().query(employeeSql, (err, data) => {
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
            const managerSql = `SELECT * FROM employee`;
            connection.promise().query(roleSql, (err, data) => {
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
                    connection.query(sql, params, (err, result) => {
                        if (err) throw err;
                        console.log("Employee has been updated");
                        viewEmployees();
                    });
                });
            });
        });
    });
};

