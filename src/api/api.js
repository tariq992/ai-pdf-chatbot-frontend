import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor is optional if you want to keep localStorage fallback
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// -----------------------
// AUTH
// -----------------------
export const registerUser = (data) => api.post("/auth/register", data);
export const loginUser = (data) => api.post("/auth/login", data);

// -----------------------
// NOTES
// -----------------------
export const getNotes = (params = {}, token) =>
  api.get("/api/notes", {
    params,
    headers: token
      ? { Authorization: `Bearer ${token}` }
      : undefined,
  });

export const createNote = (data, token) =>
  api.post("/api/notes", data, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

export const updateNote = (id, data, token) =>
  api.put(`/api/notes/${id}`, data, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

export const deleteNote = (id, token) =>
  api.delete(`/api/notes/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

// -----------------------
// AI (RAG flow)
// -----------------------
// Updated to accept explicit token
export const askAI = (data, token) =>
  api.post("/api/ai/ask", data, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

// -----------------------
// USAGE / SUBSCRIPTION
// -----------------------
export const createCheckoutSession = () =>
  api.post("/api/payments/create-checkout-session").then((res) => res.data);

export const checkSubscription = () =>
  api.post("/api/payments/mark-subscribed");

// Optional helper for notes with token
export const Token = (params = {}, token) =>
  api.get("/api/notes", {
    params,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

export default api;
