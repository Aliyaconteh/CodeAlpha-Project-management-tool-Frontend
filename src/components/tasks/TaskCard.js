export default function TaskCard({
  task,
  onEdit,
  onDelete,
  onComplete,
  canEdit = true,
  canComplete = false,
}) {
  const assignees = task.assignee_names || "Unassigned";
  const isCompleted = String(task.status).toLowerCase() === "done";
  const statusLabel = isCompleted ? "Completed" : "In Progress";
  const statusBadgeClass = isCompleted ? "text-bg-success" : "text-bg-warning text-dark";

  return (
    <div className="card shadow-sm border-0 mb-3">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h5 className="mb-1">{task.title}</h5>
            <p className="text-muted mb-2">{task.description || "No description"}</p>
            <div className="d-flex gap-2 flex-wrap">
              <span className={`badge ${statusBadgeClass}`}>{statusLabel}</span>
              <span className="badge text-bg-info">{task.priority || "MEDIUM"}</span>
              <span className="badge text-bg-light border text-dark">
                Assignees: {assignees}
              </span>
              <span className="badge text-bg-light border text-dark">
                Due: {task.due_date ? String(task.due_date).slice(0, 10) : "N/A"}
              </span>
              <span className="badge text-bg-light border text-dark">
                Project #{task.project_id}
              </span>
              <span className="badge text-bg-light border text-dark">
                Board #{task.board_id}
              </span>
            </div>
          </div>

          <div className="d-flex gap-2">
            {canComplete && task.status !== "Done" && (
              <button className="btn btn-success btn-sm" onClick={() => onComplete(task.id)}>
                Done
              </button>
            )}
            {canEdit && (
              <button className="btn btn-outline-primary btn-sm" onClick={() => onEdit(task)}>
                Edit
              </button>
            )}
            <button className="btn btn-outline-danger btn-sm" onClick={() => onDelete(task.id)}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
