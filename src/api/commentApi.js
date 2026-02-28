import api from "./axios";

export const getTaskComments = async (taskId) => {
  const res = await api.get(`/tasks/${taskId}/comments`);
  return res.data;
};

export const addTaskComment = async (taskId, message) => {
  const res = await api.post(`/tasks/${taskId}/comments`, { message });
  return res.data;
};

export const updateComment = async (commentId, message) => {
  const res = await api.put(`/comments/${commentId}`, { message });
  return res.data;
};

export const deleteComment = async (commentId) => {
  const res = await api.delete(`/comments/${commentId}`);
  return res.data;
};
