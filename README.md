# Task Management Backend

A RESTful API for managing tasks and users, built with Node.js, Express, and MongoDB.

## Features

- **User Authentication**: Secure signup and login functionality.
- **Task Management**: Create, read, update, and delete tasks.
- **User Management**: Manage user profiles.
- **Security**:
  - Password hashing with `bcrypt`
  - JWT authentication
  - Secure HTTP-only cookies
- **Data Validation**: Request validation using `validator` and Mongoose schemas.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (with Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens) & Cookies
- **Logging**: Morgan

## Getting Started

### Prerequisites

- Node.js (v14+ recommended)
- MongoDB (Local or Atlas)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd <project-folder>
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory with the following variables:

   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/your_database_name
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=90d
   ```

4. **Start the Server**
   ```bash
   node server.js
   ```

## API Endpoints

### Auth

- `POST /api/v1/auth/signup` - Register a new user
- `POST /api/v1/auth/login` - Login user

### Users

- `GET /api/v1/users` - Get all users (restricted)
- `GET /api/v1/users/:id` - Get user by ID

### Tasks

- `GET /api/v1/tasks` - Get all tasks
- `POST /api/v1/tasks` - Create a new task
- `GET /api/v1/tasks/:id` - Get task by ID
- `PATCH /api/v1/tasks/:id` - Update task
- `DELETE /api/v1/tasks/:id` - Delete task

## Project Structure

```
src/
├── db/             # Database configuration
├── middleware/     # Custom middleware (auth, logging, etc.)
├── routes/         # Route definitions
├── utils/          # Utility functions (AppError, catchAsync)
├── v1/
│   └── components/ # Feature-based components (controllers, models, routes)
│       ├── auth/
│       ├── tasks/
│       └── users/
├── app.js          # Express app setup
└── server.js       # Server entry point
```
