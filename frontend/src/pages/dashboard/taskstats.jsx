function TaskStats({ stats }) {
  if (!stats) {
    return null;
  }

  return (
    <div className="card">
      <h2>Stats</h2>

      <div className="stats-grid">
        <div className="stat-card">
          Total
          <strong>{stats.total}</strong>
        </div>

        <div className="stat-card">
          Todo
          <strong>{stats.todo}</strong>
        </div>

        <div className="stat-card">
          In Progress
          <strong>{stats.in_progress}</strong>
        </div>

        <div className="stat-card">
          Done
          <strong>{stats.done}</strong>
        </div>

        <div className="stat-card">
          Overdue
          <strong>{stats.overdue}</strong>
        </div>
      </div>
    </div>
  );
}

export default TaskStats;