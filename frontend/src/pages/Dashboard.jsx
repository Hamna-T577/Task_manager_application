import { useEffect, useState } from "react";
import TaskForm from "../components/TaskForm";
import api from "../services/api";

function Dashboard() {
  const [filter, setFilter] = useState("all");
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [darkMode, setDarkMode] = useState(
  localStorage.getItem("darkMode") === "true"
);

const toggleDarkMode = () => {
  setDarkMode((previousMode) => {
    const newMode = !previousMode;

    localStorage.setItem(
      "darkMode",
      newMode.toString()
    );

    return newMode;
  });
};

  const [searchQuery, setSearchQuery] = useState("");

  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingTask, setEditingTask] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/tasks");

      setTasks(response.data.tasks);
    } catch (error) {
      console.error("Fetch tasks error:", error);

      if (error.response) {
        setError(
          error.response.data.message ||
            "Failed to load tasks"
        );
      } else {
        setError(
          "Unable to connect to the server. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchTasks();
    } else {
      setLoading(false);
      setError("Please log in again.");
    }
  }, [token]);



  const completedTasks = tasks.filter(
  (task) => task.status === "completed"
).length;

const totalTasks = tasks.length;

const completionPercentage =
  totalTasks === 0
    ? 0
    : Math.round((completedTasks / totalTasks) * 100);
  const filteredTasks = tasks.filter((task) => {
  const matchesFilter =
    filter === "all" || task.status === filter;

  const matchesSearch = task.title
    .toLowerCase()
    .includes(searchQuery.toLowerCase());

  return matchesFilter && matchesSearch;
});

  const handleTaskCreated = (newTask) => {
    setTasks((previousTasks) => [
      newTask,
      ...previousTasks,
    ]);

    setShowTaskForm(false);
  };

  const handleCompleteTask = async (taskId) => {
    try {
      const response = await api.put(`/tasks/${taskId}`, {
  status: "completed",
});

      setTasks((previousTasks) =>
        previousTasks.map((task) =>
          task._id === taskId
            ? response.data.task
            : task
        )
      );
    } catch (error) {
      console.error("Complete task error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to complete task"
      );
    }
  };

  const handleDeleteTask = async (taskId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/tasks/${taskId}`);

      setTasks((previousTasks) =>
        previousTasks.filter(
          (task) => task._id !== taskId
        )
      );
    } catch (error) {
      console.error("Delete task error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to delete task"
      );
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
  };

  const handleTaskUpdated = (updatedTask) => {
    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task._id === updatedTask._id
          ? updatedTask
          : task
      )
    );

    setEditingTask(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  return (
    <div
  className={`dashboard ${
    darkMode ? "dark-mode" : ""
  }`}
>
      <header className="navbar">
        <div className="navbar-user">
  <span>
    Welcome, {user?.name || "User"}
  </span>

  <button
    className="theme-button"
    onClick={toggleDarkMode}
  >
    {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
  </button>

  <button
    className="logout-button"
    onClick={handleLogout}
  >
    Logout
  </button>
</div>
      </header>

      <main className="dashboard-content">
        <div className="dashboard-header">
          <div>
            <h1>My Tasks</h1>

            <p>
              Manage your daily tasks in one place.
            </p>
          </div>

          <button
            className="add-task-button"
            onClick={() => setShowTaskForm(true)}
          >
            + Add New Task
          </button>
        </div>

        {showTaskForm && (
          <TaskForm
            onTaskCreated={handleTaskCreated}
            onClose={() => setShowTaskForm(false)}
          />
        )}

        {editingTask && (
          <EditTaskForm
            task={editingTask}
            token={token}
            onTaskUpdated={handleTaskUpdated}
            onClose={() => setEditingTask(null)}
          />
        )}

        <div className="progress-card">
  <div className="progress-header">
    <div>
      <h2>Your Progress</h2>
      <p>
        {completedTasks} of {totalTasks} tasks completed
      </p>
    </div>

    <strong>{completionPercentage}%</strong>
  </div>

  <div className="progress-track">
    <div
      className="progress-fill"
      style={{
        width: `${completionPercentage}%`,
      }}
    ></div>
  </div>
</div>

        <div className="task-stats">
        <div className="stat-card">
            <span className="stat-label">All Tasks</span>
            <strong>{tasks.length}</strong>
        </div>

        <div className="stat-card">
            <span className="stat-label">Pending</span>
            <strong>
            {tasks.filter((task) => task.status === "pending").length}
            </strong>
        </div>

        <div className="stat-card">
            <span className="stat-label">Completed</span>
            <strong>
            {tasks.filter((task) => task.status === "completed").length}
            </strong>
        </div>
        </div>

        <div className="search-container">
        <input
          type="text"
          placeholder="Search tasks by title..."
          value={searchQuery}
          onChange={(event) =>
            setSearchQuery(event.target.value)
          }
        />
      </div>
        <div className="filter-buttons">
          <button
            className={
              filter === "all"
                ? "filter active"
                : "filter"
            }
            onClick={() => setFilter("all")}
          >
            All
          </button>

          <button
            className={
              filter === "pending"
                ? "filter active"
                : "filter"
            }
            onClick={() => setFilter("pending")}
          >
            Pending
          </button>

          <button
            className={
              filter === "completed"
                ? "filter active"
                : "filter"
            }
            onClick={() => setFilter("completed")}
          >
            Completed
          </button>
        </div>

        {loading ? (
          <div className="empty-state">
            <h3>Loading tasks...</h3>
          </div>
        ) : error ? (
          <div className="empty-state">
            <h3>Something went wrong</h3>

            <p>{error}</p>

            <button
              className="add-task-button"
              onClick={fetchTasks}
            >
              Try Again
            </button>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="empty-state">
            <h3>No tasks found</h3>

<p>
  {searchQuery
    ? "No tasks match your search."
    : "You don't have any tasks in this category."}
</p>
          </div>
        ) : (
          <div className="task-list">
            {filteredTasks.map((task) => (
              <div
                className="task-card"
                key={task._id}
              >
                <div className="task-info">
                  <h3>{task.title}</h3>

                  <p>
                    {task.description ||
                      "No description provided"}
                  </p>

                  <span
                    className={`status ${task.status}`}
                  >
                    {task.status}
                  </span>

                  <div className="task-meta">
  {task.dueDate && (
    <span className="due-date">
      Due:{" "}
      {new Date(task.dueDate).toLocaleDateString()}
    </span>
  )}

  <span className={`priority ${task.priority}`}>
    Priority: {task.priority}
  </span>
</div>
                </div>

                <div className="task-actions">
                  {task.status === "pending" && (
                    <button
                      className="complete-button"
                      onClick={() =>
                        handleCompleteTask(task._id)
                      }
                    >
                      Complete
                    </button>
                  )}

                  <button
                    className="edit-button"
                    onClick={() =>
                      handleEditTask(task)
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="delete-button"
                    onClick={() =>
                      handleDeleteTask(task._id)
                    }
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function EditTaskForm({
  task,
  token,
  onTaskUpdated,
  onClose,
}) {
 const [title, setTitle] = useState(task.title);

const [description, setDescription] = useState(
  task.description || ""
);

const [dueDate, setDueDate] = useState(
  task.dueDate
    ? new Date(task.dueDate).toISOString().split("T")[0]
    : ""
);

const [priority, setPriority] = useState(
  task.priority || "medium"
);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title.trim()) {
      setError("Task title is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
    const response = await api.put(`/tasks/${task._id}`, {
  title: title.trim(),
  description: description.trim(),
  dueDate: dueDate || null,
  priority,
});
      onTaskUpdated(response.data.task);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to update task"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="task-form-card">
      <div className="task-form-header">
        <div>
          <h2>Edit Task</h2>

          <p>Update your task details.</p>
        </div>

        <button
          type="button"
          className="close-button"
          onClick={onClose}
        >
          ×
        </button>
      </div>

      {error && (
        <p className="error-message">{error}</p>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="edit-title">Title</label>

          <input
            type="text"
            id="edit-title"
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
          />
        </div>

        <div className="form-group">
          <label htmlFor="edit-description">
            Description
          </label>

          <textarea
            id="edit-description"
            rows="4"
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
          />
        </div>

        <div className="task-form-row">
  <div className="form-group">
    <label htmlFor="edit-due-date">
      Due Date
    </label>

    <input
      type="date"
      id="edit-due-date"
      value={dueDate}
      onChange={(event) =>
        setDueDate(event.target.value)
      }
    />
  </div>

  <div className="form-group">
    <label htmlFor="edit-priority">
      Priority
    </label>

    <select
      id="edit-priority"
      value={priority}
      onChange={(event) =>
        setPriority(event.target.value)
      }
    >
      <option value="low">Low</option>
      <option value="medium">Medium</option>
      <option value="high">High</option>
    </select>
  </div>
</div>

        <div className="task-form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Dashboard;