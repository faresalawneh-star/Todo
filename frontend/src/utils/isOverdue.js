export function isOverdue(dueDate, status) {
  if (!dueDate) return false;
  if (status === "done") return false;

  const now = new Date();
  const due = new Date(dueDate);

  return due < now;
}