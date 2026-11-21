
import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [newTask, setNewTask] = useState({
    title: "",
    project: "",
    priority: "Medium",
    due: "",
  });

  // Retrieve tasks from MySQL
  async function fetchTasks() {
    try {
      const response = await fetch("http://localhost:5000/api/tasks");

      if (!response.ok) {
        throw new Error("Failed to retrieve tasks.");
      }

      const data = await response.json();
      setTasks(data);
      setError("");
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Unable to load tasks. Please check your backend server.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  // Calculate dashboard statistics
  const completed = tasks.filter((task) => task.status === "Done").length;
  const pending = tasks.filter((task) => task.status === "To Do").length;
  const inProgress = tasks.filter(
    (task) => task.status === "In Progress"
  ).length;

  // Save a new task to MySQL
  async function addTask(e) {
    e.preventDefault();

    if (!newTask.title.trim() || !newTask.project.trim()) {
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save task.");
      }

      // Refresh tasks using the database records
      await fetchTasks();

      setNewTask({
        title: "",
        project: "",
        priority: "Medium",
        due: "",
      });

      setShowForm(false);
    } catch (err) {
      console.error("Error saving task:", err);
      setError(err.message || "Unable to save task.");
    } finally {
      setSaving(false);
    }
  }

  // Update task status (backend connection will be added next)
 async function updateStatus(id, status) {
    try {
        const response = await fetch(
            `http://localhost:5000/api/tasks/${id}/status`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to update status");
        }

        setTasks((currentTasks) =>
            currentTasks.map((task) =>
                task.id === id ? { ...task, status } : task
            )
        );
    } catch (error) {
        console.error("Status update error:", error);
        alert(error.message);
    }
}

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-icon">T</span> TaskFlow
        </div>

        <p className="nav-label">WORKSPACE</p>
        <a className="nav-item active">▦ <span>Dashboard</span></a>
        <a className="nav-item">▣ <span>Projects</span></a>
        <a className="nav-item">✓ <span>My Tasks</span></a>
        <a className="nav-item">◷ <span>Deadlines</span></a>

        <div className="sidebar-bottom">
          <div className="profile">
            <div className="avatar">A</div>
            <div>
              <strong>Administrator</strong>
              <small>Admin Account</small>
            </div>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <span className="breadcrumb">Workspace /</span> Dashboard
          </div>
          <div className="top-user">
            <div className="avatar">A</div>
            <span>Administrator</span>
          </div>
        </header>

        <section className="content">
          <div className="welcome">
            <div>
              <p className="eyebrow">OVERVIEW</p>
              <h1>Project Dashboard</h1>
              <p className="subheading">
                Track your team's projects and stay on top of tasks.
              </p>
            </div>

            <button
              className="primary-btn"
              onClick={() => {
                setShowForm(!showForm);
                setError("");
              }}
            >
              + Add New Task
            </button>
          </div>

          {error && <p className="error-message">{error}</p>}

          {showForm && (
            <form className="task-form" onSubmit={addTask}>
              <h3>Create a new task</h3>

              <input
                placeholder="Task title"
                value={newTask.title}
                onChange={(e) =>
                  setNewTask({ ...newTask, title: e.target.value })
                }
                required
              />

              <input
                placeholder="Project name"
                value={newTask.project}
                onChange={(e) =>
                  setNewTask({ ...newTask, project: e.target.value })
                }
                required
              />

              <select
                value={newTask.priority}
                onChange={(e) =>
                  setNewTask({ ...newTask, priority: e.target.value })
                }
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>

              <input
                type="date"
                value={newTask.due}
                onChange={(e) =>
                  setNewTask({ ...newTask, due: e.target.value })
                }
              />

              <button
                className="primary-btn"
                type="submit"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Task"}
              </button>
            </form>
          )}

          <div className="stats">
            <div className="stat-card">
              <div className="stat-top">
                <span>Total Tasks</span>
                <span className="stat-icon blue">▤</span>
              </div>
              <h2>{tasks.length}</h2>
              <small>All assigned tasks</small>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <span>Completed</span>
                <span className="stat-icon green">✓</span>
              </div>
              <h2>{completed}</h2>
              <small>Successfully finished</small>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <span>In Progress</span>
                <span className="stat-icon orange">◷</span>
              </div>
              <h2>{inProgress}</h2>
              <small>Currently being worked on</small>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <span>To Do</span>
                <span className="stat-icon purple">☰</span>
              </div>
              <h2>{pending}</h2>
              <small>Waiting to be started</small>
            </div>
          </div>

          <section className="panel">
            <div className="panel-heading">
              <div>
                <h2>Recent Tasks</h2>
                <p>Manage and monitor your team's assignments.</p>
              </div>
              <span className="task-count">{tasks.length} tasks</span>
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>TASK NAME</th>
                    <th>PROJECT</th>
                    <th>PRIORITY</th>
                    <th>DUE DATE</th>
                    <th>STATUS</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="empty">
                        Loading tasks...
                      </td>
                    </tr>
                  ) : tasks.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="empty">
                        No tasks yet. Add your first task.
                      </td>
                    </tr>
                  ) : (
                    tasks.map((task) => (
                      <tr key={task.id}>
                        <td><strong>{task.title}</strong></td>
                        <td>{task.project || "No project"}</td>
                        <td>
                          <span className={`priority ${task.priority.toLowerCase()}`}>
                            {task.priority}
                          </span>
                        </td>
                        <td>{task.due || "Not set"}</td>
                        <td>
                          <select
                            className={`status ${task.status.toLowerCase().replace(" ", "-")}`}
                            value={task.status}
                            onChange={(e) =>
                              updateStatus(task.id, e.target.value)
                            }
                          >
                            <option>To Do</option>
                            <option>In Progress</option>
                            <option>Done</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <p className="footer">
            TaskFlow © 2026 · Simple Project Task and Assignment Tracking System
          </p>
        </section>
      </main>
    </div>
  );
}

export default App;
