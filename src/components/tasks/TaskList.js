import TaskCard from "./TaskCard";

export default function TaskList({
  tasks,
  onEdit,
  onDelete,
  onComplete,
  loading = false,
  currentUserId = null,
}) {
  if (loading) {
    return <div className="alert alert-info">Loading tasks...</div>;
  }

  if (!tasks.length) {
    return <div className="alert alert-secondary">No tasks found.</div>;
  }

  return (
    <div>
      {tasks.map((task) => {
        const assigneeIds = task.assignee_ids
          ? String(task.assignee_ids)
              .split(",")
              .map((id) => Number(id.trim()))
              .filter((id) => Number.isInteger(id))
          : [];
        const isCreator = currentUserId !== null && Number(task.created_by) === Number(currentUserId);
        const isAssignee = currentUserId !== null && assigneeIds.includes(Number(currentUserId));

        return (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            onComplete={onComplete}
            canEdit={isCreator}
            canComplete={isCreator || isAssignee}
          />
        );
      })}
    </div>
  );
}
