# Task Manager App

A full-stack Task Manager application built using the MERN stack.

This project was developed as part of a MERN Internship Task and includes secure user authentication, task management, filtering, search, task priorities, due dates, progress tracking, and dark/light mode support.

---

## Features

### Authentication

- User Signup
- User Login
- JWT-based authentication
- Password hashing using bcrypt
- Protected dashboard
- User-specific private tasks
- Logout functionality

### Task Management

- Create tasks
- View tasks
- Edit tasks
- Delete tasks
- Mark tasks as completed
- Task status: Pending / Completed

### Task Filtering and Search

- View all tasks
- Filter Pending tasks
- Filter Completed tasks
- Search tasks by title

### Bonus Features

- Due Date
- Priority: Low / Medium / High
- Completed Percentage progress bar
- Dark Mode / Light Mode
- Responsive design

---

## Tech Stack

### Frontend

- React
- Vite
- Axios
- React Router
- CSS

### Backend

- Node.js
- Express.js
- JWT
- bcryptjs
- dotenv
- CORS

### Database

- MongoDB
- Mongoose

---

## Project Structure

```text
task-manager-app/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md



## Installation

### Prerequisites

Make sure the following are installed:

- Node.js
- npm
- MongoDB Atlas account
- Git

---

## Backend Setup

Open a terminal and go to the backend folder:

```bash
cd backend

Install dependencies:

npm install

Create a .env file inside the backend folder:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

Start the backend:

npm run dev

The backend will run on:

http://localhost:5000
Frontend Setup

Open another terminal and go to the frontend folder:

cd frontend

Install dependencies:

npm install

Start the frontend:

npm run dev

The frontend will run on:

http://localhost:5173
Application Workflow
User
  ↓
Signup
  ↓
Password hashed using bcrypt
  ↓
User stored in MongoDB
  ↓
Login
  ↓
JWT token generated
  ↓
Dashboard
  ↓
Create / View / Edit / Delete Tasks
  ↓
Complete Tasks
  ↓
Filter / Search Tasks
  ↓
Track Completion Progress
API Endpoints
Authentication
POST /api/auth/signup
POST /api/auth/login
Tasks
POST   /api/tasks
GET    /api/tasks
PUT    /api/tasks/:id
DELETE /api/tasks/:id

All task APIs require JWT authentication.

Security

The application uses:

bcrypt for password hashing
JWT for authentication
Protected backend routes
User-specific task ownership
Environment variables for sensitive configuration
.gitignore to prevent sensitive files from being committed
Screens
Login

Users can log in using their registered email and password.

Signup

New users can create an account.

Dashboard

Users can:

View their tasks
Add new tasks
Edit tasks
Delete tasks
Complete tasks
Filter tasks
Search tasks
View progress
Set due dates and priorities
Switch between dark and light mode
Future Improvements

Possible future improvements include:

Pagination
Task reminders
Email notifications
Drag-and-drop task organization
Advanced analytics
Task categories
Demo

backend deployed in render:

 https://task-manager-application-5.onrender.com
 
Author

Developed as part of a MERN Internship Task.


### One more important change


Use:

```text
backend/
├── controllers/
├── middleware/
├── models/
├── routes/
├── .env.example
├── server.js
└── package.json

Then we should create .env.example later with:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret



Demo video:

https://drive.google.com/file/d/1C8dAQqpahx-QAokwVsbUVKGlVxzGXZnO/view?usp=sharing