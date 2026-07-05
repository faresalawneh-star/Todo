import TaskItem from "./TaskItem";

function TaskList({
  tasks,
  editingTaskId,
  editData,
  onEditChange,
  onUpdateTask,
  onStartEditing,
  onCancelEditing,
  onDeleteTask,
  onStatusChange,
}) {
  if (tasks.length === 0) {
    return <p>No tasks found.</p>;
  }

  return (
    <ul>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          editingTaskId={editingTaskId}
          editData={editData}
          onEditChange={onEditChange}
          onUpdateTask={onUpdateTask}
          onStartEditing={onStartEditing}
          onCancelEditing={onCancelEditing}
          onDeleteTask={onDeleteTask}
          onStatusChange={onStatusChange}
        />
      ))}
    </ul>
  );
}

export default TaskList;