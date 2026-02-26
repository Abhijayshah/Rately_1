import axios from 'axios';

const getBaseUrl = () => {
  let url;
  if (process.env.REACT_APP_API_URL) {
    url = process.env.REACT_APP_API_URL;
  } else if (process.env.NODE_ENV === 'production') {
    url = 'https://rately-aq95.onrender.com/api';
  } else {
    url = 'http://localhost:5002/api';
  }

  // Ensure URL ends with /api
  if (!url.endsWith('/api')) {
    url = `${url}/api`;
  }
  
  // Fix double slash if present (e.g. /api/api -> /api)
  if (url.endsWith('/api/api')) {
    url = url.replace('/api/api', '/api');
  }
  
  return url;
};

// Create axios instance with base configuration
const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Check if the error is from the login endpoint
    const isLoginRequest = error.config?.url?.includes('/auth/login');

    if (error.response?.status === 401 && !isLoginRequest) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
  updatePassword: (passwordData) => api.put('/auth/password', passwordData),
};

// Admin API
export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
  createUser: (userData) => api.post('/admin/users', userData),
  getUsers: (params) => api.get('/admin/users', { params }),
  getUserById: (id) => api.get(`/admin/users/${id}`),
  updateUser: (id, userData) => api.put(`/admin/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  createStore: (storeData) => api.post('/admin/stores', storeData),
  getStores: (params) => api.get('/admin/stores', { params }),
};

// Store API
export const storeAPI = {
  getStores: (params) => api.get('/stores', { params }),
  getStoreById: (id) => api.get(`/stores/${id}`),
  submitRating: (ratingData) => api.post('/stores/ratings', ratingData),
  getUserRatings: (params) => api.get('/stores/user/ratings', { params }),
  getOwnerDashboard: (params) => api.get('/stores/owner/dashboard', { params }),
};

// Chat API
export const chatAPI = {
  sendMessage: (payload) => api.post('/chat/message', payload),
  sendMessagePublic: (payload) => api.post('/chat/message/public', payload),
};

// Utility functions
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    return error.response.data?.error || 'An error occurred';
  } else if (error.request) {
    // Request was made but no response received
    return 'Network error. Please check your connection.';
  } else {
    // Something else happened
    return 'An unexpected error occurred';
  }
};

export const isNetworkError = (error) => {
  return !error.response && error.request;
};

export default api;
