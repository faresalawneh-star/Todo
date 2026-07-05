import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function Dashboard() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);

  const [filters, setFilters] = useState({
    search: "",
    status: "",
    ordering: "-created_at",
  });

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "todo",
    due_date: "",
  });

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editData, setEditData] = useState({
    title: "",
    description: "",
    status: "todo",
    due_date: "",
  });

  async function fetchTasks(pageNumber = page) {
    try {
      const params = new URLSearchParams();

      params.append("page", pageNumber);

      if (filters.search) {
        params.append("search", filters.search);
      }

      if (filters.status) {
        params.append("status", filters.status);
      }

      if (filters.ordering) {
        params.append("ordering", filters.ordering);
      }

      const response = await API.get(`tasks/?${params.toString()}`);

      setTasks(response.data.results);
      setNextPage(response.data.next);
      setPreviousPage(response.data.previous);
      setPage(pageNumber);
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
    fetchTasks(1);
    fetchStats();
  }, []);

  function handleLogout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  }

  function handleCreateChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  function handleFilterChange(e) {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  }

  function handleEditChange(e) {
    setEditData({
      ...editData,
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

      fetchTasks(1);
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

  async function handleDeleteTask(taskId) {
    const confirmDelete = window.confirm("Are you sure you want to delete this task?");

    if (!confirmDelete) {
      return;
    }

    try {
      await API.delete(`tasks/${taskId}/`);

      fetchTasks(page);
      fetchStats();
    } catch (err) {
      console.log(err.response?.data);
      setError("Failed to delete task.");
    }
  }

  async function handleStatusChange(taskId, newStatus) {
    try {
      await API.patch(`tasks/${taskId}/`, {
        status: newStatus,
      });

      fetchTasks(page);
      fetchStats();
    } catch (err) {
      console.log(err.response?.data);
      setError("Failed to update task status.");
    }
  }

  function startEditing(task) {
    setEditingTaskId(task.id);

    setEditData({
      title: task.title,
      description: task.description || "",
      status: task.status,
      due_date: task.due_date ? task.due_date.slice(0, 16) : "",
    });
  }

  function cancelEditing() {
    setEditingTaskId(null);

    setEditData({
      title: "",
      description: "",
      status: "todo",
      due_date: "",
    });
  }

  async function handleUpdateTask(e) {
    e.preventDefault();

    try {
      const updatedTask = {
        title: editData.title,
        description: editData.description,
        status: editData.status,
        due_date: editData.due_date || null,
      };

      await API.put(`tasks/${editingTaskId}/`, updatedTask);

      cancelEditing();
      fetchTasks(page);
      fetchStats();
    } catch (err) {
      console.log(err.response?.data);

      if (err.response?.data) {
        setError(JSON.stringify(err.response.data));
      } else {
        setError("Failed to update task.");
      }
    }
  }

  function handleApplyFilters(e) {
    e.preventDefault();
    fetchTasks(1);
  }

  function handleClearFilters() {
    setFilters({
      search: "",
      status: "",
      ordering: "-created_at",
    });

    setTimeout(() => {
      fetchTasks(1);
    }, 0);
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
            onChange={handleCreateChange}
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
            onChange={handleCreateChange}
          />
        </div>

        <br />

        <div>
          <label>Status</label>
          <br />
          <select
            name="status"
            value={formData.status}
            onChange={handleCreateChange}
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
            onChange={handleCreateChange}
          />
        </div>

        <br />

        <button type="submit">Create Task</button>
      </form>

      <hr />

      <h2>Filters</h2>

      <form onSubmit={handleApplyFilters}>
        <div>
          <label>Search</label>
          <br />
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Search title or description"
          />
        </div>

        <br />

        <div>
          <label>Status</label>
          <br />
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="">All</option>
            <option value="todo">Todo</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        <br />

        <div>
          <label>Ordering</label>
          <br />
          <select
            name="ordering"
            value={filters.ordering}
            onChange={handleFilterChange}
          >
            <option value="-created_at">Newest First</option>
            <option value="created_at">Oldest First</option>
            <option value="title">Title A-Z</option>
            <option value="-title">Title Z-A</option>
            <option value="-updated_at">Recently Updated</option>
          </select>
        </div>

        <br />

        <button type="submit">Apply Filters</button>
        <button type="button" onClick={handleClearFilters}>
          Clear Filters
        </button>
      </form>

      <hr />

      <h2>Your Tasks</h2>

      {tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.id} style={{ marginBottom: "24px" }}>
              {editingTaskId === task.id ? (
                <form onSubmit={handleUpdateTask}>
                  <div>
                    <label>Title</label>
                    <br />
                    <input
                      type="text"
                      name="title"
                      value={editData.title}
                      onChange={handleEditChange}
                      required
                    />
                  </div>

                  <br />

                  <div>
                    <label>Description</label>
                    <br />
                    <textarea
                      name="description"
                      value={editData.description}
                      onChange={handleEditChange}
                    />
                  </div>

                  <br />

                  <div>
                    <label>Status</label>
                    <br />
                    <select
                      name="status"
                      value={editData.status}
                      onChange={handleEditChange}
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
                      value={editData.due_date}
                      onChange={handleEditChange}
                    />
                  </div>

                  <br />

                  <button type="submit">Save</button>
                  <button type="button" onClick={cancelEditing}>
                    Cancel
                  </button>
                </form>
              ) : (
                <div>
                  <strong>{task.title}</strong>
                  <br />
                  Status: {task.status}
                  <br />
                  Description: {task.description || "No description"}
                  <br />
                  Due Date: {task.due_date || "No due date"}
                  <br />

                  <label>Quick Status Update: </label>
                  <select
                    value={task.status}
                    onChange={(e) =>
                      handleStatusChange(task.id, e.target.value)
                    }
                  >
                    <option value="todo">Todo</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>

                  <br />
                  <br />

                  <button onClick={() => startEditing(task)}>Edit</button>
                  <button onClick={() => handleDeleteTask(task.id)}>
                    Delete
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <hr />

      <div>
        <button
          disabled={!previousPage}
          onClick={() => fetchTasks(page - 1)}
        >
          Previous
        </button>

        <span style={{ margin: "0 12px" }}>Page {page}</span>

        <button
          disabled={!nextPage}
          onClick={() => fetchTasks(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Dashboard;