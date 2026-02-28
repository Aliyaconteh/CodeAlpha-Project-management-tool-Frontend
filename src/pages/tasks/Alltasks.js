import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import TaskList from "../../components/tasks/TaskList";
import { completeTask, deleteTask, getAllTasks } from "../../api/taskApi";
import { AuthContext } from "../../context/AuthContext";

export default function Alltasks() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTasks = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAllTasks();
      setTasks(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = async (taskId) => {
    const ok = window.confirm("Delete this task?");
    if (!ok) return;

    setError("");
    try {
      await deleteTask(taskId);
      await fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete task");
    }
  };

  const handleEdit = (task) => {
    navigate("/tasks/create", { state: { task } });
  };

  const handleComplete = async (taskId) => {
    try {
      await completeTask(taskId);
      await fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to complete task");
    }
  };

  return (
    <div className="d-flex wg-shell" style={{ minHeight: "100vh" }}>
      <Sidebar />

      <div className="flex-grow-1 bg-light wg-main">
        <Navbar title="Tasks" />

        <div className="container py-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="mb-0">All Tasks</h4>
            <div className="btn-group">
              <button
                className="btn btn-primary"
                onClick={() => navigate("/tasks/create")}
              >
                Add Task
              </button>
              <button
                className="btn btn-outline-primary"
                onClick={() => navigate("/tasks/my")}
              >
                My Tasks
              </button>
            </div>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <TaskList
            tasks={tasks}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onComplete={handleComplete}
            loading={loading}
            currentUserId={user?.id}
          />
        </div>
      </div>
    </div>
  );
}

