import api from '../api';

const authService = {
  login: async (credentials) => {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
  },

  signup: async (credentials) => {
    const response = await api.post('/api/auth/signup', credentials);
    return response.data;
  },
};

export default authService;