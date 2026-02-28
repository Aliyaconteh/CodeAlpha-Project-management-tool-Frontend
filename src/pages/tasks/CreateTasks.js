import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import TaskForm from "../../components/tasks/TaskForm";
import { createTask, updateTask } from "../../api/taskApi";
import { getMyProjects, getProjectMembers } from "../../api/projectApi";
import { getBoardsByProject } from "../../api/boardApi";

export default function CreateTasks() {
  const navigate = useNavigate();
  const location = useLocation();
  const editingTask = location.state?.task || null;

  const [projects, setProjects] = useState([]);
  const [boards, setBoards] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(
    editingTask?.project_id ? String(editingTask.project_id) : ""
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await getMyProjects();
        setProjects(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load projects");
      }
    };

    loadProjects();
  }, []);

  useEffect(() => {
    const pid = Number(selectedProjectId);
    if (!pid) {
      setBoards([]);
      setMembers([]);
      return;
    }

    const loadProjectData = async () => {
      try {
        const [boardRows, memberRows] = await Promise.all([
          getBoardsByProject(pid),
          getProjectMembers(pid),
        ]);
        setBoards(boardRows);
        setMembers(memberRows);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load project data");
      }
    };

    loadProjectData();
  }, [selectedProjectId]);

  const handleSubmit = async (payload) => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      if (editingTask?.id) {
        await updateTask(editingTask.id, payload);
        setSuccess("Task updated successfully");
      } else {
        await createTask(payload);
        setSuccess("Task created successfully");
      }
      navigate("/tasks");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex wg-shell" style={{ minHeight: "100vh" }}>
      <Sidebar />
      <div className="flex-grow-1 bg-light wg-main">
        <Navbar title={editingTask ? "Edit Task" : "Create Task"} />
        <div className="container py-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="mb-0">{editingTask ? "Edit Task" : "Add Task"}</h4>
            <div className="btn-group">
              <button className="btn btn-outline-primary" onClick={() => navigate("/tasks")}>
                All Tasks
              </button>
              <button className="btn btn-outline-primary" onClick={() => navigate("/tasks/my")}>
                My Tasks
              </button>
            </div>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          {!projects.length && (
            <div className="alert alert-warning">
              Create a project and at least one board before creating tasks.
            </div>
          )}

          <TaskForm
            onSubmit={handleSubmit}
            onProjectChange={setSelectedProjectId}
            initialValues={editingTask || undefined}
            projects={projects}
            boards={boards}
            members={members}
            submitLabel={editingTask ? "Update Task" : "Create Task"}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}

