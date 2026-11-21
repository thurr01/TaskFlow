
CREATE DATABASE IF NOT EXISTS taskflow_db;
USE taskflow_db;

CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('Administrator', 'Project Manager', 'Team Member')
        NOT NULL DEFAULT 'Team Member',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects (
    project_id INT AUTO_INCREMENT PRIMARY KEY,
    project_name VARCHAR(150) NOT NULL,
    description TEXT,
    manager_id INT,
    start_date DATE,
    due_date DATE,
    status ENUM('Active', 'Completed', 'On Hold') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (manager_id) REFERENCES users(user_id)
        ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS tasks (
    task_id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    assigned_to INT,
    created_by INT,
    task_title VARCHAR(150) NOT NULL,
    description TEXT,
    priority ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',
    status ENUM('To Do', 'In Progress', 'Done') DEFAULT 'To Do',
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(project_id)
        ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES users(user_id)
        ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(user_id)
        ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS task_history (
    history_id INT AUTO_INCREMENT PRIMARY KEY,
    task_id INT NOT NULL,
    changed_by INT,
    old_status VARCHAR(30),
    new_status VARCHAR(30),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(task_id)
        ON DELETE CASCADE,
    FOREIGN KEY (changed_by) REFERENCES users(user_id)
        ON DELETE SET NULL
);
