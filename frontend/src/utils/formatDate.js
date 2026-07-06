export function formatDate(dateValue) {
  if (!dateValue) {
    return "No due date";
  }

  const date = new Date(dateValue);

  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}