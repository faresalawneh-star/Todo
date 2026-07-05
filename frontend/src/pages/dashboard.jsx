import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function Dashboard() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  async function fetchTasks() {
    try {
      const response = await API.get("tasks/");

      // Because backend pagination returns: { count, next, previous, results }
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
              Description: {task.description}
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