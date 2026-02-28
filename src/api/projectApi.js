import api from "./axios";

export const getMyProjects = async () => {
  const res = await api.get("/projects");
  return res.data;
};

export const createProject = async (payload) => {
  const res = await api.post("/projects", payload);
  return res.data;
};

export const deleteProject = async (projectId) => {
  const res = await api.delete(`/projects/${projectId}`);
  return res.data;
};

export const addProjectMember = async (projectId, email) => {
  const res = await api.post(`/projects/${projectId}/members`, { email });
  return res.data;
};

export const getProjectMembers = async (projectId) => {
  const res = await api.get(`/projects/${projectId}/members`);
  return res.data;
};
