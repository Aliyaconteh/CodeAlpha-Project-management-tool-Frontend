import api from "./axios";

export const getBoardsByProject = async (projectId) => {
  const res = await api.get(`/boards/projects/${projectId}/boards`);
  return res.data;
};

export const createBoard = async (projectId, title) => {
  const res = await api.post(`/projects/${projectId}/boards`, { title });
  return res.data;
};
