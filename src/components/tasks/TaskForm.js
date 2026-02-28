import { useEffect, useState } from "react";

const EMPTY_TASK = {
  title: "",
  description: "",
  priority: "MEDIUM",
  status: "To Do",
  due_date: "",
  project_id: "",
  board_id: "",
  assignee_ids: "",
};

export default function TaskForm({
  onSubmit,
  onProjectChange,
  initialValues = EMPTY_TASK,
  projects = [],
  boards = [],
  members = [],
  submitLabel = "Save Task",
  loading = false,
}) {
  const [form, setForm] = useState(initialValues);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    setForm((prev) => ({
      ...EMPTY_TASK,
      ...prev,
      ...initialValues,
      project_id: initialValues.project_id || "",
      board_id: initialValues.board_id || "",
      due_date: initialValues.due_date ? String(initialValues.due_date).slice(0, 10) : "",
      assignee_ids:
        initialValues.assignee_ids ||
        (Array.isArray(initialValues.assignees)
          ? initialValues.assignees.map((item) => item.user_id).join(",")
          : ""),
    }));
  }, [initialValues]);

  const handleChange = (e) => {
    const nextForm = { ...form, [e.target.name]: e.target.value };
    if (e.target.name === "project_id") {
      nextForm.board_id = "";
      nextForm.assignee_ids = "";
      if (onProjectChange) onProjectChange(e.target.value);
    }
    setForm(nextForm);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError("");

    if (!form.project_id || !form.board_id) {
      setFormError("Please select both project and board.");
      return;
    }

    onSubmit({
      ...form,
      project_id: Number(form.project_id),
      board_id: Number(form.board_id),
      due_date: form.due_date || null,
      assignee_ids: form.assignee_ids,
    });
  };

  const handleAssigneeSelect = (e) => {
    const ids = Array.from(e.target.selectedOptions).map((option) => option.value);
    setForm({ ...form, assignee_ids: ids.join(",") });
  };

  const selectedAssigneeIds = form.assignee_ids
    ? String(form.assignee_ids)
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean)
    : [];

  return (
    <form onSubmit={handleSubmit} className="card shadow-sm border-0">
      <div className="card-body">
        {formError && <div className="alert alert-danger">{formError}</div>}
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Title</label>
            <input
              className="form-control"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Project</label>
            <select
              className="form-select"
              name="project_id"
              value={form.project_id}
              onChange={handleChange}
              required
            >
              <option value="">Select project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label">Board</label>
            <select
              className="form-select"
              name="board_id"
              value={form.board_id}
              onChange={handleChange}
              required
              disabled={!form.project_id || !boards.length}
            >
              <option value="">Select board</option>
              {boards.map((board) => (
                <option key={board.id} value={board.id}>
                  {board.title}
                </option>
              ))}
            </select>
            {!!form.project_id && !boards.length && (
              <small className="text-danger">
                No boards found for this project. Create a board first on the Projects page.
              </small>
            )}
          </div>

          <div className="col-md-4">
            <label className="form-label">Priority</label>
            <select
              className="form-select"
              name="priority"
              value={form.priority}
              onChange={handleChange}
            >
              <option>LOW</option>
              <option>MEDIUM</option>
              <option>HIGH</option>
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label">Status</label>
            <select
              className="form-select"
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option>To Do</option>
              <option>In Progress</option>
              <option>Done</option>
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label">Due Date</label>
            <input
              type="date"
              className="form-control"
              name="due_date"
              value={form.due_date ? String(form.due_date).slice(0, 10) : ""}
              onChange={handleChange}
            />
          </div>

          <div className="col-12">
            <label className="form-label">Assignees</label>
            <select
              className="form-select"
              multiple
              value={selectedAssigneeIds}
              onChange={handleAssigneeSelect}
              disabled={!form.project_id || !members.length}
            >
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.full_name} ({member.email})
                </option>
              ))}
            </select>
            <small className="text-muted">Hold Ctrl/Cmd to select multiple users.</small>
          </div>

          <div className="col-12">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              rows="3"
              name="description"
              value={form.description || ""}
              onChange={handleChange}
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary mt-3"
          disabled={loading || !form.project_id || !form.board_id}
        >
          {loading ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
