import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL; 

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  console.log("Token being sent:", token);
  if (token) {
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
export const getNotes = (params = {}) => api.get("/api/notes", { params });
export const createNote = (data) => api.post("/api/notes", data);
export const updateNote = (id, data) => api.put(`/api/notes/${id}`, data);
export const deleteNote = (id) => api.delete(`/api/notes/${id}`);

// -----------------------
// AI (RAG flow)
// -----------------------
export const askAI = (data) => api.post("/api/ai/ask", data);

// -----------------------
// USAGE / SUBSCRIPTION
// -----------------------

// Create a Stripe Checkout session
export const createCheckoutSession = () =>
  api.post("/api/payments/create-checkout-session").then(res => res.data);

// Mark the user as subscribed in DB
export const checkSubscription = () => api.post("/api/payments/mark-subscribed");

export default api;
