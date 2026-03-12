CREATE DATABASE IF NOT EXISTS taskdb;
USE taskdb;

CREATE TABLE IF NOT EXISTS tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('todo', 'in-progress', 'done') DEFAULT 'todo',
  priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO tasks (title, description, status, priority) VALUES
('Set up Docker', 'Install Docker and Docker Compose on all machines', 'done', 'high'),
('Build REST API', 'Create Node.js Express backend with MySQL', 'in-progress', 'high'),
('Design Frontend', 'Build React UI for task management', 'todo', 'medium'),
('Write Tests', 'Unit and integration tests for API', 'todo', 'low');
