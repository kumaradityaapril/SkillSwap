import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: 'https://skillswap-3-ko34.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

console.log('API Base URL:', api.defaults.baseURL);

// Add a request interceptor to include auth token
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

export default api;
