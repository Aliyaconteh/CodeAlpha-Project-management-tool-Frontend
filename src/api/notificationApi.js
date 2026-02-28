import api from "./axios";

export const getNotifications = async () => {
  const res = await api.get("/notifications");
  return res.data;
};

export const markNotificationAsRead = async (notificationId) => {
  const res = await api.put(`/notifications/${notificationId}/read`);
  return res.data;
};

export const deleteNotification = async (notificationId) => {
  const res = await api.delete(`/notifications/${notificationId}`);
  return res.data;
};

export const markAllNotificationsAsRead = async () => {
  const res = await api.put("/notifications/read-all");
  return res.data;
};
