import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

const instance = axios.create({
  baseURL: API_BASE_URL,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
