
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

// Home route
app.get("/", (req, res) => {
    res.send("TaskFlow Backend is running!");
});

// GET: Retrieve all tasks
app.get("/api/tasks", (req, res) => {
    const sql = `
        SELECT
            t.task_id AS id,
            t.task_title AS title,
            p.project_name AS project,
            t.priority,
            t.status,
            DATE_FORMAT(t.due_date, '%Y-%m-%d') AS due
        FROM tasks t
        LEFT JOIN projects p
            ON t.project_id = p.project_id
        ORDER BY t.created_at DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                message: "Failed to retrieve tasks"
            });
        }

        res.json(results);
    });
});

// POST: Add a new task
app.post("/api/tasks", (req, res) => {
    const { title, project, priority, due } = req.body;

    if (!title || !project) {
        return res.status(400).json({
            message: "Task title and project are required"
        });
    }

    db.query(
        "SELECT project_id FROM projects WHERE project_name = ? LIMIT 1",
        [project],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    message: "Failed to find project"
                });
            }

            const saveTask = (projectId) => {
                const sql = `
                    INSERT INTO tasks
                    (project_id, task_title, priority, status, due_date)
                    VALUES (?, ?, ?, 'To Do', ?)
                `;

                db.query(
                    sql,
                    [projectId, title, priority || "Medium", due || null],
                    (err, result) => {
                        if (err) {
                            console.error(err);
                            return res.status(500).json({
                                message: "Failed to save task"
                            });
                        }

                        res.status(201).json({
                            message: "Task created successfully",
                            id: result.insertId,
                            title,
                            project,
                            priority: priority || "Medium",
                            status: "To Do",
                            due: due || null
                        });
                    }
                );
            };

            if (results.length > 0) {
                saveTask(results[0].project_id);
            } else {
                db.query(
                    "INSERT INTO projects (project_name) VALUES (?)",
                    [project],
                    (err, result) => {
                        if (err) {
                            console.error(err);
                            return res.status(500).json({
                                message: "Failed to create project"
                            });
                        }

                        saveTask(result.insertId);
                    }
                );
            }
        }
    );
});

// PATCH: Update task status
app.patch("/api/tasks/:id/status", (req, res) => {
    const taskId = req.params.id;
    const { status } = req.body;

    const allowedStatuses = ["To Do", "In Progress", "Done"];

    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
            message: "Invalid task status"
        });
    }

    // Get the current status
    db.query(
        "SELECT status FROM tasks WHERE task_id = ?",
        [taskId],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    message: "Failed to retrieve task"
                });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    message: "Task not found"
                });
            }

            const oldStatus = results[0].status;

            // Update the task
            db.query(
                "UPDATE tasks SET status = ? WHERE task_id = ?",
                [status, taskId],
                (err) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({
                            message: "Failed to update task"
                        });
                    }

                    // Record the status change in task history
                    if (oldStatus !== status) {
                        db.query(
                            `INSERT INTO task_history
                            (task_id, old_status, new_status)
                            VALUES (?, ?, ?)`,
                            [taskId, oldStatus, status],
                            (err) => {
                                if (err) {
                                    console.error(err);
                                    return res.status(500).json({
                                        message: "Task updated, but history could not be saved"
                                    });
                                }

                                res.json({
                                    message: "Task status updated successfully",
                                    id: Number(taskId),
                                    status
                                });
                            }
                        );
                    } else {
                        res.json({
                            message: "Task status is unchanged",
                            id: Number(taskId),
                            status
                        });
                    }
                }
            );
        }
    );
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`TaskFlow server running on port ${PORT}`);
});
