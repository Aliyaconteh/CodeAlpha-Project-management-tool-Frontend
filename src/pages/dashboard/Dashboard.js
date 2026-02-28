import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { useEffect, useState } from "react";
import { getAllTasks } from "../../api/taskApi";
import { getNotifications } from "../../api/notificationApi";

export default function Dashboard() {
  const [totalTasks, setTotalTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);
  const [recentTasks, setRecentTasks] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      setError("");
      try {
        const [tasks, notifications] = await Promise.all([getAllTasks(), getNotifications()]);
        setTotalTasks(tasks.length);
        setCompletedTasks(tasks.filter((task) => task.status === "Done").length);
        setNotificationCount(notifications.filter((n) => !n.is_read).length);
        setRecentTasks(tasks.slice(0, 5));
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load dashboard data");
      }
    };

    loadData();
  }, []);

  return (
    <div className="d-flex wg-shell" style={{ minHeight: "100vh" }}>
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN */}
      <div className="flex-grow-1 bg-light wg-main">
        {/* NAVBAR */}
        <Navbar title="Dashboard" />

        {/* CONTENT */}
        <div className="container py-4">
          {error && <div className="alert alert-danger">{error}</div>}

          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  <h6 className="text-muted">Total Tasks</h6>
                  <h3 className="fw-bold">{totalTasks}</h3>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  <h6 className="text-muted">Completed</h6>
                  <h3 className="fw-bold">{completedTasks}</h3>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  <h6 className="text-muted">Unread Notifications</h6>
                  <h3 className="fw-bold">{notificationCount}</h3>
                </div>
              </div>
            </div>
          </div>

          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Recent Activity</h5>
              {!recentTasks.length && (
                <p className="text-muted mb-0">
                  No activity yet. Start by creating tasks and assigning them.
                </p>
              )}
              {!!recentTasks.length && (
                <ul className="mb-0">
                  {recentTasks.map((task) => (
                    <li key={task.id}>
                      {task.title} ({task.status})
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

