import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import NotificationList from "../../components/notifications/NotificationList";
import {
  deleteNotification,
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../../api/notificationApi";

export default function Notifications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getNotifications();
      setItems(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onMarkRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to mark notification as read");
    }
  };

  const onDelete = async (id) => {
    try {
      await deleteNotification(id);
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete notification");
    }
  };

  const onReadAll = async () => {
    try {
      await markAllNotificationsAsRead();
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to mark all as read");
    }
  };

  return (
    <div className="d-flex wg-shell" style={{ minHeight: "100vh" }}>
      <Sidebar />
      <div className="flex-grow-1 bg-light wg-main">
        <Navbar title="Notifications" />
        <div className="container py-4">
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="d-flex justify-content-end mb-3">
            <button className="btn btn-outline-primary btn-sm" onClick={onReadAll}>
              Mark all as read
            </button>
          </div>
          <NotificationList
            items={items}
            onMarkRead={onMarkRead}
            onDelete={onDelete}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}

