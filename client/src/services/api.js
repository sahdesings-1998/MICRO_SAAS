import axios from "axios";

// Production-safe API base URL configuration
// Uses environment variable if available, falls back to localhost for development
const getBaseURL = () => {
  // Check for Vite environment variable (VITE_API_URL)
  const envURL = import.meta.env.VITE_API_URL;
  
  if (envURL) {
    // Production: Use deployed backend URL
    return envURL.endsWith('/') ? envURL : `${envURL}/`;
  }
  
  // Development fallback
  return "http://localhost:5000/api/";
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 30000,
  withCredentials: true // Enable for JWT in Authorization header
});

// Request interceptor: Add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor: Handle errors and auth
api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Handle 401 Unauthorized
    if (err?.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("user");
      
      // Redirect to login only in browser environment
      if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }
    
    // Log errors in development
    if (import.meta.env.DEV) {
      console.error("API Error:", err?.response?.status, err?.response?.data || err?.message);
    }
    
    return Promise.reject(err);
  }
);

export default api;
