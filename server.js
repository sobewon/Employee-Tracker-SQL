const express = require('express');
const mysql = require('mysql2');
const cTable = require('console.table');
const inquirer = require('inquirer');
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
    console.log(`DB connected`)
);

//test to select all from employee
db.query('SELECT * FROM employee', (error, results) => {
    if (error) throw error;
    console.log(`\n`)
    console.table(results);
});

async function promptUser() {
    while (true) {
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
            case 'View All Employees':
                console.log('\ncode for view all empl')
                db.query('SELECT * FROM employee', (error, results) => {
                    if (error) throw error;
                    console.log('\n');
                    console.table(results);
                });
                break;
            case 'Add Employee':
                console.log('\ncode for adding empl')
                break;
            case 'Update Employee Role':
                console.log('\ncode for updating emp role')
                break;
            case 'View All Roles':
                console.log('\ncode for view allrolls')
                db.query('SELECT * FROM role', (error, results) => {
                    if (error) throw error;
                    console.log('\n');
                    console.table(results);
                });
                break
            case 'Add Role':
                console.log('\ncode for adding role')
                break;
            case 'View All Departments':
                console.log('\ncode for viewing all Departments')
                db.query('SELECT * FROM department', (error, results) => {
                    if (error) throw error;
                    console.log('\n');
                    console.table(results);
                });
                break;
            case 'Add Department':
                console.log('\ncode for adding Departments')
                break;
            case 'Exit':
                // Exit the loop and the program
                console.log('\nExiting program');
                return process.exit(0);
            default:
                console.log('\nInvalid option\n');
                break;
        }
    }
    
}

promptUser();