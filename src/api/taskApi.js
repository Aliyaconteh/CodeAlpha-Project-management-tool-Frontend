import api from "./axios";

export const getAllTasks = async () => {
  const res = await api.get("/tasks");
  return res.data;
};

export const getMyTasks = async () => {
  const res = await api.get("/tasks/my-tasks");
  return res.data;
};

export const createTask = async (payload) => {
  const res = await api.post("/tasks", payload);
  return res.data;
};

export const updateTask = async (taskId, payload) => {
  const res = await api.put(`/tasks/${taskId}`, payload);
  return res.data;
};

export const deleteTask = async (taskId) => {
  const res = await api.delete(`/tasks/${taskId}`);
  return res.data;
};

export const completeTask = async (taskId) => {
  const res = await api.put(`/tasks/${taskId}/complete`);
  return res.data;
};
