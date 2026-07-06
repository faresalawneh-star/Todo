export function formatStatus(status) {
  if (status === "todo") {
    return "Todo";
  }

  if (status === "in_progress") {
    return "In Progress";
  }

  if (status === "done") {
    return "Done";
  }

  return status;
}