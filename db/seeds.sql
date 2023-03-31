INSERT INTO department (name)
VALUES ('Sales');

INSERT INTO role (title, salary, department_id)
VALUES
    ('Sales Associate', 50000, 1),
    ('Sales Manager', 80000, 1),
    ('Regional Sales Manager', 100000, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('John', 'Magnuson', 1, 1),
    ('Darth', 'Vader', 3, 1),
    ('Luke', 'Skywalker', 2, 2),
    ('Leia', 'Organa', 1, 3),
    ('Obiwan', 'Kenobi', 3, NULL);