import axios from 'axios';

// Create an axios instance with a base URL that matches your backend
// If your original code was working, let's keep the same configuration
const api = axios.create({
  // Use the exact same base URL that was working before
  baseURL: 'http://localhost:5000'
});

// Add auth token to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      localStorage.removeItem('userRole');
      
      // Redirect to login page
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api; 