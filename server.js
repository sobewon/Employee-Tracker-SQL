const express = require('express');
const mysql = require('mysql2');
const cTable = require('console.table');
const inquirer = require('inquirer');
const { error } = require('console');
require('dotenv').config();

//const PORT = process.env.PORT || 3001;
//not needed because it's all in console
const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());

const db = mysql.createConnection(
    {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    },
);

//test to select all from employee
/*
db.query('SELECT * FROM employee', (error, results) => {
    if (error) throw error;
    console.log(`\n`)
    console.table(results);
}); */

async function promptUser() {
    let isRun = true;
    while (isRun) {
        //get full list of employees
        const employeeList = await new Promise((resolve, reject) => {
            db.query('SELECT * FROM employee', (error, employeeList) => {
                if (error) reject(error);
                resolve(employeeList);
            });
        });

        const [roles, employees] = await Promise.all([
            //  list of roles
            new Promise((resolve, reject) => {
                db.query('SELECT id, title FROM role', (error, roles) => {
                    if (error) reject(error);
                    resolve(roles);
                });
            }),
            //  list of employees names
            new Promise((resolve, reject) => {
                db.query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee', (error, employees) => {
                    if (error) reject(error);
                    resolve(employees);
                    });
            })
        ]);

        const answer = await inquirer.prompt([
            {
            type: 'list',
            name: 'option',
            message: 'What would you like to do?',
            choices: ['View All Employees',
                'Add Employee',
                'Update Employee Role',
                'View All Roles',
                'Add Role',
                'View All Departments',
                'Add Department',
                'Exit'],
            }
        ])
        switch (answer.option) {
            case 'View All Employees': //finished
                console.log('\ncode for view all empl')
                try {
                    console.log('\n Printing Table: \n');
                    console.table(employeeList);
                    console.log(`\n`);
                } catch (error) {
                    console.log('Error:', error);
                }
                break;
                case 'Add Employee':
                    try {
                        console.log('\nAdding Employee\n');
                        const employee = await inquirer.prompt([
                            {
                                type: 'input',
                                name: 'first_name',
                                message: 'Enter the first name of the employee:'
                            },
                            {
                                type: 'input',
                                name: 'last_name',
                                message: 'Enter the last name of the employee:'
                            },
                            {
                                type: 'list',
                                name: 'role_id',
                                message: 'What is the role of the employee:',
                                choices: roles.map(role => ({ name: role.title, value: role.id })),
                            },
                            {
                                type: 'list',
                                name: 'manager_id',
                                message: 'Who is the Employee\'s manager?',
                                choices: [
                                    { name: 'None', value: null }, // Add a "None" option to allow employees without managers
                                    ...employees.map(employee => ({ name: employee.name, value: employee.id }))
                                ],
                            }
                        ]);
                      // insert new emp
                        await new Promise((resolve, reject) => {
                            const dbQuery = `
                                INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                VALUES (?, ?, ?, ?)
                                `;
                            db.query(dbQuery, [employee.first_name, employee.last_name, employee.role_id, employee.manager_id], (error, result) => {
                                if (error) reject(error);
                                console.log('\nEmployee added successfully!\n');
                                resolve(result);
                            });
                        });
                    } catch (error) {
                        console.error('Error:', error);
                    }
                    break;



            case 'Update Employee Role':
                console.log('\nUpdating Employee Role\n')
                try {
                    const updateEmployee = await inquirer.prompt([
                        {
                            type: 'list',
                            name: 'employee',
                            message: 'Which employee do you want to update?',
                            choices: employees.map(employee => ({ name: `${employee.first_name} ${employee.last_name}`, value: employee.id }))
                        },
                        {
                            type: 'list',
                            name: 'role',
                            message: 'Which role do you want to assign to the employee?',
                            choices: roles.map(role => ({ name: role.title, value: role.id }))
                        }
                    ])
                    await new Promise((resolve, reject) => {
                        const dbQuery = `UPDATE employee SET role_id = ? WHERE id = ?`;
                        db.query(dbQuery, [updateEmployee.role, updateEmployee.employee], (error, result) => {
                            if (error) reject(error);
                            console.log(`\nSuccessfully updated employee's role!\n`);
                            resolve(result);
                        });
                    });
                }catch {error} {
                    console.error('Next')
                }

                break;
            case 'View All Roles': //fin
                console.log('\ncode for view allrolls')
                try {
                    const results = await new Promise((resolve, reject) => {
                        db.query('SELECT * FROM role', (error, results) => {
                            if (error) reject(error);
                            resolve(results);
                        });
                    });
                    console.log('\n Printing Table: \n');
                    console.table(results);
                    console.log(`\n`);
                } catch (error) {
                    console.log('Error:', error);
                }
                break;
            case 'Add Role': //fin
                console.log('\nAdd a Role\n');
                const newRole = await inquirer.prompt([
                    {
                        type: 'input',
                        name: 'title',
                        message: 'Please enter role title: ',
                    },
                    {
                        type: 'input',
                        name: 'salary',
                        message: 'Please input salary amount: ',
                    },
                    {
                        type: 'input',
                        name: 'department_id',
                        message: 'Please input department id # for the new role',
                    }
                ]);
                try {
                    const result = await db.promise().query(
                        'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)',
                        [newRole.title, newRole.salary, newRole.department_id]
                    );
                    console.log(`\n${result[0].affectedRows} role added!\n`)
                } catch (error) {
                    console.log(error);
                }
                break;
            case 'View All Departments': // fin
                console.log('\ncode for viewing all Departments')
                try {
                    const results = await new Promise((resolve, reject) => {
                        db.query('SELECT * FROM department', (error, results) => {
                            if (error) reject(error);
                            resolve(results);
                        });
                    });
                    console.log('\n Printing Table: \n');
                    console.table(results);
                    console.log(`\n`);
                } catch (error) {
                    console.log('Error:', error);
                }
                break;
            case 'Add Department':// fin
                console.log('\nAdd Department\n');
                const newDept = await inquirer.prompt([
                    {
                        type: 'input',
                        name: 'name',
                        message: 'Enter new department name',
                    }
                ]);
                try {
                    const result = await db.promise().query('INSERT INTO department (name) VALUES (?)', [newDept.name]);
                    console.log(`\nNew department: ${newDept.name} added`);
                } catch (error) {
                    console.error(`\n Next`);
                }
                break;
            case 'Exit'://fin
                // Exit the loop and the program
                console.log('\nExiting program');
                isRun = false;
                process.exit(0)
            default:
                console.log('\nInvalid option\n');
                break;
        }
    }
    
}

promptUser();