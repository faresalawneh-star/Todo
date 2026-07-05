function TaskItem({
  task,
  editingTaskId,
  editData,
  onEditChange,
  onUpdateTask,
  onStartEditing,
  onCancelEditing,
  onDeleteTask,
  onStatusChange,
}) {
  if (editingTaskId === task.id) {
    return (
        <li className="task-item">
          <form onSubmit={onUpdateTask}>
          <div>
            <label>Title</label>
            <br />
            <input
              type="text"
              name="title"
              value={editData.title}
              onChange={onEditChange}
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
              onChange={onEditChange}
            />
          </div>

          <br />

          <div>
            <label>Status</label>
            <br />
            <select
              name="status"
              value={editData.status}
              onChange={onEditChange}
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
              onChange={onEditChange}
            />
          </div>

          <br />
          <button type="submit">Save</button>
          <button type="button" className="secondary-btn" onClick={onCancelEditing}>
  Cancel
</button>

        </form>
      </li>
    );
  }

  return (
    <li style={{ marginBottom: "24px" }}>
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
          onChange={(e) => onStatusChange(task.id, e.target.value)}
        >
          <option value="todo">Todo</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <br />
        <br />
<div className="task-actions">
        <button onClick={() => onStartEditing(task)}>Edit</button>

        <button className="delete-btn" onClick={() => onDeleteTask(task.id)}>
         Delete
        </button>
        </div>
    </div>
    </li>
  );
}

export default TaskItem;