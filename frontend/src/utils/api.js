import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: 'https://skilldep.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  withCredentials: true,
  crossDomain: true
});

// Add request interceptor for logging
api.interceptors.request.use(request => {
  console.log('Starting Request', JSON.stringify(request, null, 2));
  return request;
});

// Add response interceptor for logging
api.interceptors.response.use(response => {
  console.log('Response:', response);
  return response;
}, error => {
  console.error('Error:', error.response || error);
  return Promise.reject(error);
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
