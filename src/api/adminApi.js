import api from "./axios";

export const getAllUsers = async () => {
  const res = await api.get("/admin/users");
  return res.data;
};

export const deleteUser = async (userId) => {
  const res = await api.delete(`/admin/users/${userId}`);
  return res.data;
};
