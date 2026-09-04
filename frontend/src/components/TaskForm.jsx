import { useState } from "react";
import api from "../services/api";

function TaskForm({ onTaskCreated, onClose }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.title.trim()) {
      setError("Task title is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.post("/tasks", {
        title: formData.title,
        description: formData.description,
        dueDate: formData.dueDate || null,
        priority: formData.priority,
      });

     
      onTaskCreated(response.data.task);

      setFormData({
        title: "",
        description: "",
        dueDate: "",
        priority: "medium",
      });

      onClose();
    } catch (error) {
      if (error.response) {
        setError(
          error.response.data.message ||
            "Failed to create task"
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

  return (
    <div className="task-form-card">
      <div className="task-form-header">
        <div>
          <h2>Add New Task</h2>

          <p>
            Create a new task to manage your work.
          </p>
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
          <label htmlFor="task-title">Title</label>

          <input
            type="text"
            id="task-title"
            name="title"
            placeholder="Enter task title"
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="task-description">
            Description
          </label>

          <textarea
            id="task-description"
            name="description"
            placeholder="Enter task description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div className="task-form-row">
          <div className="form-group">
            <label htmlFor="task-due-date">
              Due Date
            </label>

            <input
              type="date"
              id="task-due-date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="task-priority">
              Priority
            </label>

            <select
              id="task-priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
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
            {loading ? "Adding Task..." : "Add Task"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default TaskForm;