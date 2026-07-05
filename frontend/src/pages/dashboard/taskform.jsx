function TaskForm({ formData, onChange, onSubmit }) {
  return (
    <div>
      <h2>Create Task</h2>

      <form onSubmit={onSubmit}>
        <div>
          <label>Title</label>
          <br />
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={onChange}
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
            onChange={onChange}
          />
        </div>

        <br />

        <div>
          <label>Status</label>
          <br />
          <select
            name="status"
            value={formData.status}
            onChange={onChange}
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
            onChange={onChange}
          />
        </div>

        <br />

        <button type="submit">Create Task</button>
      </form>
    </div>
  );
}

export default TaskForm;