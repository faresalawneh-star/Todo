function TaskFilters({
  filters,
  onChange,
  onApplyFilters,
  onClearFilters,
}) {
  return (
    <div>
      <h2>Filters</h2>

      <form onSubmit={onApplyFilters}>
        <div>
          <label>Search</label>
          <br />
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={onChange}
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
            onChange={onChange}
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
            onChange={onChange}
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
        <button type="button" onClick={onClearFilters}>
          Clear Filters
        </button>
      </form>
    </div>
  );
}

export default TaskFilters;