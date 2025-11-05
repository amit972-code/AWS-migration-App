Task Management App (3-Tier Web Application)
Overview

This is a simple 3-tier web application built using:

Frontend (Presentation Tier): HTML, CSS, JS

Backend (Logic/Application Tier): Node.js + Express

Database (Data Tier): MySQL

The application allows users to:

Register new accounts

Login

Add, view, and delete tasks (user-specific)

This app is Dockerized for easy deployment and can later be migrated to AWS Free Tier services.

File Structure
task-app/
├── backend/                  # Node.js backend
│   ├── server.js             # Main backend server
│   ├── package.json          # Node.js dependencies
│   └── package-lock.json
├── frontend/                 # Frontend files
│   ├── index.html
│   ├── style.css
│   └── app.js
├── db/                       # Database initialization
│   └── init.sql
├── docker-compose.yml        # Docker Compose configuration
└── README.md                 # This file

Technologies Used
Tier	Technology	Purpose
Presentation Tier	HTML, CSS, JS	User interface for login, registration, dashboard, task management
Logic/Application Tier	Node.js + Express	Handles authentication, task CRUD operations, and communicates with MySQL
Data Tier	MySQL	Stores user credentials and tasks persistently
Docker	Docker + Docker Compose	Containerizes frontend, backend, and database
Database Setup

File: db/init.sql

CREATE DATABASE IF NOT EXISTS task_manager;

USE task_manager;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    task_name VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


users table stores usernames and passwords.

tasks table stores tasks for each user.

Backend Setup (Node.js + Express)

File: backend/server.js

Handles login, registration, task management.

Communicates with MySQL database.

Exposes REST APIs:

Method	Endpoint	Purpose
POST	/api/register	Register a new user
POST	/api/login	Login user
GET	/api/tasks/:userId	Get tasks for a user
POST	/api/tasks	Add a task
DELETE	/api/tasks/:taskId	Delete a task

Dependencies:

"express", "mysql", "body-parser", "cors"

Frontend Setup

Files: frontend/index.html, frontend/style.css, frontend/app.js

Login Form: Username & password input

Register Form: Create a new account

Dashboard: Add, view, delete tasks

Fetch API: Communicates with backend APIs for all actions

Docker Setup

File: docker-compose.yml

version: '3'
services:
  db:
    image: mysql:8
    container_name: task_db
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: root123
      MYSQL_DATABASE: task_manager
    ports:
      - "3306:3306"
    volumes:
      - db_data:/var/lib/mysql
      - ./db/init.sql:/docker-entrypoint-initdb.d/init.sql

  backend:
    build: ./backend
    container_name: task_backend
    restart: always
    ports:
      - "3000:3000"
    depends_on:
      - db
    volumes:
      - ./backend:/usr/src/app
    working_dir: /usr/src/app
    command: ["node","server.js"]

volumes:
  db_data:


MySQL service: Runs database

Backend service: Runs Node.js server, waits for DB

Volumes: Persist database and backend files

Ports: Expose DB (3306) and backend API (3000)

How It Works (3-Tier Flow)

Frontend (Presentation Tier):

Users interact with login/register forms or dashboard.

Sends HTTP requests (via Fetch API) to the backend.

Backend (Logic/Application Tier):

Receives requests, validates input, queries MySQL database.

Sends back responses to frontend.

Database (Data Tier):

Stores users and tasks permanently.

Backend queries update the database (CRUD operations).

Flow Diagram:

[Frontend (HTML/JS)]
       |
       v
[Backend (Node.js/Express)]
       |
       v
[Database (MySQL)]

Steps to Run Locally with Docker

Clone repository:

git clone <repo-url>
cd task-app


Build and run containers:

docker-compose up --build


Access the app:

Frontend: http://localhost:3000/frontend/index.html (or serve via any static server)

Backend APIs: http://localhost:3000/api/...

Login / Register and manage tasks.

Future AWS Migration

Use Amazon RDS for MySQL database

Use Amazon EC2 or Elastic Beanstalk for Node.js backend

Use S3 + CloudFront for hosting static frontend files

Connect frontend to backend API over public endpoints

✅ Summary

Fully functional 3-tier web application with MySQL database

Dockerized for easy deployment

Can be migrated to AWS Free Tier services

Clear separation:

Frontend: User interface

Backend: Business logic + API

Database: Persistent storage