import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

import TaskStats from "./TaskStats";
import TaskForm from "./TaskForm";
import TaskFilters from "./TaskFilters";
import TaskList from "./TaskList";
import Pagination from "./Pagination";

function Dashboard() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [taskToDelete, setTaskToDelete] = useState(null);

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
      setError("");
      const taskData = {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        due_date: formData.due_date || null,
      };

      await API.post("tasks/", taskData);
      setSuccess("Task created successfully!");


      setFormData({
        title: "",
        description: "",
        status: "todo",
        due_date: "",
      });

      fetchTasks(1);
      fetchStats();

      setTimeout(() => {
      setSuccess("");
      }, 3000);

    } catch (err) {
      console.log(err.response?.data);

      if (err.response?.data) {
        setError(JSON.stringify(err.response.data));
      } else {
        setError("Failed to create task.");
      }
    }
  }


function handleDeleteTask(task) {
  setTaskToDelete(task);
}

async function confirmDeleteTask() {
  if (!taskToDelete) return;

  try {
    await API.delete(`tasks/${taskToDelete.id}/`);

    setSuccess("Task deleted successfully!");
    setTaskToDelete(null);

    fetchTasks(page);
    fetchStats();

    setTimeout(() => {
      setSuccess("");
    }, 3000);
  } catch (err) {
    console.log(err.response?.data);
    setError("Failed to delete task.");
  }
}

function cancelDeleteTask() {
  setTaskToDelete(null);
}


  async function handleStatusChange(taskId, newStatus) {
    try {
      setError("");
      await API.patch(`tasks/${taskId}/`, {
        status: newStatus,
      });
      setSuccess("Task status updated successfully!");

      fetchTasks(page);
      fetchStats();

      setTimeout(() => {
      setSuccess("");
      }, 3000);

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
      setSuccess("Task updated successfully!");

      cancelEditing();
      fetchTasks(page);
      fetchStats();

      setTimeout(() => {
      setSuccess("");
      }, 3000);

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
      {taskToDelete && (
  <div className="modal-overlay">
    <div className="modal">
      <h3>Delete Task?</h3>

      <p>
        Are you sure you want to delete{" "}
        <strong>{taskToDelete.title}</strong>?
      </p>

      <div className="modal-actions">
        <button className="secondary-btn" onClick={cancelDeleteTask}>
          Cancel
        </button>

        <button className="delete-btn" onClick={confirmDeleteTask}>
          Delete
        </button>
      </div>
    </div>
  </div>
)}

<h1 className="dashboard-title">Dashboard</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <div className="toast-success">{success}</div>}

      <TaskStats stats={stats} />

<div className="card">
  <TaskForm
    formData={formData}
    onChange={handleCreateChange}
    onSubmit={handleCreateTask}
  />
</div>

<div className="card">
  <TaskFilters
    filters={filters}
    onChange={handleFilterChange}
    onApplyFilters={handleApplyFilters}
    onClearFilters={handleClearFilters}
  />
</div>

<div className="card">
  <h2>Your Tasks</h2>

  <TaskList
    tasks={tasks}
    editingTaskId={editingTaskId}
    editData={editData}
    onEditChange={handleEditChange}
    onUpdateTask={handleUpdateTask}
    onStartEditing={startEditing}
    onCancelEditing={cancelEditing}
    onDeleteTask={handleDeleteTask}
    onStatusChange={handleStatusChange}
  />
</div>

<div className="card">
  <Pagination
    page={page}
    nextPage={nextPage}
    previousPage={previousPage}
    onPageChange={fetchTasks}
  />
</div>
    </div>
  );
}
 


export default Dashboard;
