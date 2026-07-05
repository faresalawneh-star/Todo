function TaskStats({ stats }) {
  if (!stats) {
    return null;
  }

  return (
    <div>
      <h2>Stats</h2>
      <p>Total: {stats.total}</p>
      <p>Todo: {stats.todo}</p>
      <p>In Progress: {stats.in_progress}</p>
      <p>Done: {stats.done}</p>
      <p>Overdue: {stats.overdue}</p>
    </div>
  );
}

export default TaskStats;