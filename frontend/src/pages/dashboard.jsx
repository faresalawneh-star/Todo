import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function Dashboard() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "todo",
    due_date: "",
  });

  async function fetchTasks() {
    try {
      const response = await API.get("tasks/");

      // Backend pagination returns: { count, next, previous, results }
      setTasks(response.data.results);
    } catch (err) {
      console.log(err.response?.data);

      if (err.response?.status === 401) {
        setError("You must login first.");
        navigate("/login");
      } else {
        setError("Failed to load tasks.");
      }
    }
  }

  async function fetchStats() {
    try {
      const response = await API.get("tasks/stats/");
      setStats(response.data);
    } catch (err) {
      console.log(err.response?.data);
    }
  }

  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, []);

  function handleLogout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  }

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleCreateTask(e) {
    e.preventDefault();

    setError("");

    try {
      const taskData = {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        due_date: formData.due_date || null,
      };

      await API.post("tasks/", taskData);

      setFormData({
        title: "",
        description: "",
        status: "todo",
        due_date: "",
      });

      fetchTasks();
      fetchStats();
    } catch (err) {
      console.log(err.response?.data);

      if (err.response?.data) {
        setError(JSON.stringify(err.response.data));
      } else {
        setError("Failed to create task.");
      }
    }
  }

  return (
    <div>
      <h1>Dashboard</h1>

      <button onClick={handleLogout}>Logout</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {stats && (
        <div>
          <h2>Stats</h2>
          <p>Total: {stats.total}</p>
          <p>Todo: {stats.todo}</p>
          <p>In Progress: {stats.in_progress}</p>
          <p>Done: {stats.done}</p>
          <p>Overdue: {stats.overdue}</p>
        </div>
      )}

      <hr />

      <h2>Create Task</h2>

      <form onSubmit={handleCreateTask}>
        <div>
          <label>Title</label>
          <br />
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div>
          <label>Description</label>
          <br />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <br />

        <div>
          <label>Status</label>
          <br />
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="todo">Todo</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        <br />

        <div>
          <label>Due Date</label>
          <br />
          <input
            type="datetime-local"
            name="due_date"
            value={formData.due_date}
            onChange={handleChange}
          />
        </div>

        <br />

        <button type="submit">Create Task</button>
      </form>

      <hr />

      <h2>Your Tasks</h2>

      {tasks.length === 0 ? (
        <p>No tasks yet.</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              <strong>{task.title}</strong>
              <br />
              Status: {task.status}
              <br />
              Description: {task.description || "No description"}
              <br />
              Due Date: {task.due_date || "No due date"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dashboard;