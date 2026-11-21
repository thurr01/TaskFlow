## TaskFlow: Simple Project Task and Assignment Tracking System

**Group Members:**

- Addi, Zhanica M.
- Alumbullo, Jesse Martine P.
- Guarte, Alaine B.
- Montero, Marlvince Arthur A.
- Viadnes, Caesar Sean G.

## TaskFlow

TaskFlow is a web-based project and task management system built with React, Express, Node.js, and MySQL. It helps small teams organize projects, create task assignments, set priorities and deadlines, and monitor task progress through a centralized dashboard.

## Requirements

- Node.js and npm
- MySQL Server 8 or newer
- MySQL Workbench
- Git

## Setup

1. Clone the repository:

   ```bash
   git clone YOUR_GITHUB_REPOSITORY_LINK
   cd TaskFlow
   ```

2. Create the MySQL database by opening `server/database.sql` in MySQL Workbench.

3. Execute the SQL script to create the required tables:
   - `users`
   - `projects`
   - `tasks`
   - `task_history`

4. Create a `.env` file inside the `server` folder and configure the database connection:

   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=taskflow_db
   PORT=5000
   ```

   Replace `your_mysql_password` with your local MySQL password.

5. Install dependencies and run each application in a separate terminal.

   **Backend:**

   ```bash
   cd server
   npm install
   node server.js
   ```

   **Frontend:**

   ```bash
   cd client
   npm install
   npm run dev
   ```

   The backend runs at `http://localhost:5000`, while Vite provides the frontend address, usually `http://localhost:5173`.

## Features

- Create tasks with a title, project name, priority, and due date.
- Automatically create a project when adding a task under a project name that does not yet exist.
- View all saved tasks in the dashboard.
- Organize tasks by project.
- Set task priorities to Low, Medium, or High.
- Update task statuses between To Do, In Progress, and Done.
- View dashboard statistics, including total tasks, completed tasks, tasks in progress, and pending tasks.
- Record task status changes in the task history table.
- Store and retrieve task records using a MySQL database.

## API

- `GET /` — Check if the TaskFlow backend is running.
- `GET /api/tasks` — Retrieve all tasks from the database.
- `POST /api/tasks` — Create a new task and save it to the database.
- `PATCH /api/tasks/:id/status` — Update a task's status and record the change in task history.

## Database Structure

The application uses a MySQL database named `taskflow_db`.

- `users` — Stores user account information and roles.
- `projects` — Stores project details.
- `tasks` — Stores task information, priorities, deadlines, and statuses.
- `task_history` — Records changes made to task statuses.

## Development Team

BS Information Technology – 2A

Zamboanga Peninsula Polytechnic State University