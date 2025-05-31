import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: 'https://skilldep.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'Accept': 'application/json'
  },
  withCredentials: true,
  crossDomain: true,
  timeout: 10000 // 10 seconds
});

// Add request interceptor for logging
api.interceptors.request.use(request => {
  console.log('=== Request ===');
  console.log('URL:', request.method?.toUpperCase(), request.url);
  console.log('Headers:', request.headers);
  console.log('Data:', request.data);
  return request;
}, error => {
  console.error('Request Error:', error);
  return Promise.reject(error);
});

// Add response interceptor for logging
api.interceptors.response.use(response => {
  console.log('=== Response ===');
  console.log('Status:', response.status, response.statusText);
  console.log('URL:', response.config.url);
  console.log('Headers:', response.headers);
  console.log('Data:', response.data);
  return response;
}, error => {
  if (error.response) {
    // The request was made and the server responded with a status code
    console.error('Response Error:', {
      status: error.response.status,
      statusText: error.response.statusText,
      url: error.response.config.url,
      headers: error.response.headers,
      data: error.response.data
    });
  } else if (error.request) {
    // The request was made but no response was received
    console.error('No Response:', {
      message: error.message,
      request: error.request
    });
  } else {
    // Something happened in setting up the request
    console.error('Request Setup Error:', error.message);
  }
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
