# 📝 Notes Management Application (MERN Stack)
👩‍💻 Author

Areeba
MERN Stack Intern – 10P SHINE Program

📌 Project Overview

The Notes Management Application is a full-stack web application developed using the MERN stack. The application enables users to securely create, edit, view, and delete personal notes. Each user’s data is protected through authentication and authorization mechanisms to ensure privacy and data integrity.

This project is being developed as part of the 10P SHINE MERN Internship Program and follows enterprise-level software development practices, including clean architecture, structured logging, centralized error handling, unit testing, and static code analysis.

🎯 Project Objectives

Build a secure, user-centric notes application

Implement authentication and authorization using industry standards

Follow clean and scalable backend architecture

Integrate structured logging and centralized error handling

Ensure application reliability through unit testing

Maintain high code quality using SonarQube

Use Git with a professional branching strategy

✨ Key Features
🔐 User Authentication & Authorization

User registration, login, and logout functionality

JWT-based authentication

Secure password hashing

Protected APIs and frontend routes

Notes accessible only by their respective owners

🗒️ Notes Management

Create, read, update, and delete notes

Notes linked to authenticated users

Rich text editor for enhanced writing experience

User-specific dashboard to manage notes

📊 Application Logging (Pino Logger)

Structured JSON logging using Pino Logger

Logs include:

HTTP requests and responses

User authentication events

Note creation, updates, and deletions

Application errors and exceptions

🗄️ Database Integration

MySQL database for persistent storage

Relational schema with proper foreign key constraints

Secure storage of user data

⚠️ Global Error Handling

Centralized error-handling middleware

Graceful handling of:

Validation errors

Authentication and authorization failures

Database and server errors

Errors logged using Pino Logger

🧪 Unit Testing
Backend

Mocha & Chai for unit testing

Coverage for controllers, services, and repositories

Frontend

Jest for component and service testing

API mocking for isolated tests

📈 Code Quality (SonarQube)

SonarQube integration for static code analysis

Detection of:

Code smells

Bugs

Security vulnerabilities

Enforced JavaScript coding standards

🎨 Frontend (React.js)

Interactive and responsive UI

Modular, component-based architecture

Screens include:

Sign Up / Login

Notes Dashboard

Rich Text Note Editor

User Profile (optional)

🛠️ Technology Stack
Backend

Node.js

Express.js

MySQL

JWT Authentication

Pino Logger

Mocha & Chai

Frontend

React.js

Axios

React Router

Rich Text Editor (React Quill / Draft.js)

Jest

Tools & Quality

SonarQube

Git & GitHub

📂 Project Structure
areeba-mern-10pshine/
 ┣ backend/
 ┃ ┗ src/
 ┣ frontend/
 ┃ ┗ src/
 ┣ README.md

🔀 Git & Branching Strategy

main: Production-ready code

develop: Integration branch

Feature branches:

feature/backend/<feature-name>

feature/frontend/<feature-name>

Bugfix branches:

bugfix/backend/<issue>

bugfix/frontend/<issue>

🚀 Future Enhancements

Real-time note updates using Socket.IO

Search and filter functionality

Export notes to PDF or text files

✅ Internship Evaluation Alignment

This project fulfills all internship requirements by implementing:

Full-stack MERN development

Secure authentication & authorization

Logging and error handling

Unit testing

Code quality analysis

Professional Git workflow

📎 License

This project is developed for educational and internship evaluation purposes.