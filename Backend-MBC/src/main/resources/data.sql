INSERT INTO users (username, email, password, role, enabled, created_at)
SELECT 'admin', 'admin@mbc.edu', '$2a$10$wE3oD7D3lqg7nE8v1f3xQO1vC7iQz0w5qvT1xI0yqQJt5Wz9A9k3W', 'ADMIN', 1, NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username='admin');
-- Password is "admin123" (BCrypt)

INSERT INTO users (id, username, email, password, role, enabled, created_at) 
VALUES (1, 'student1', 'student1@mbc.com', '$2a$10$Q9SGkNfQdFJo7YmV5Dj2TeeZRm4d8dX5xDJR2RUDrR8eFjS1r77p6', 'STUDENT', true, NOW());

INSERT INTO users (id, username, email, password, role, enabled, created_at) 
VALUES (2, 'teacher1', 'teacher1@mbc.com', '$2a$10$ZbHbJhtC8Eo9S.ABpn5r3OP3iOYyIoB7lOpiH9m4.sHbQf2LfV9Oy', 'TEACHER', true, NOW());

INSERT INTO users (id, username, email, password, role, enabled, created_at) 
VALUES (3, 'admin1', 'admin1@mbc.com', '$2a$10$dFUwT94pYFQxQ3R8h5z8/OcDgzMFgwZQ3NHOYxDvvgycTTHYOvAiK', 'ADMIN', true, NOW());

