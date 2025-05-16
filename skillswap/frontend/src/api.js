import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000', // Replace with your backend API URL if different
});

export default api;