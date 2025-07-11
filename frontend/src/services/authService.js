import api from './api';
import {
  LOGIN_URL,
  REGISTER_URL,
  SEND_CODE_URL,
  RECOVER_URL
} from './api';

export const authService = {

  login: async (credentials) => {
    try {
      const response = await api.post(LOGIN_URL, credentials);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login error');
    }
  },


  register: async (userData) => {
    try {
      const response = await api.post(REGISTER_URL, userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error registering user');
    }
  },


  sendRecoveryCode: async (email) => {
    try {
      const response = await api.post(SEND_CODE_URL, { email });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error sending recovery code');
    }
  },

 
  resetPassword: async (resetData) => {
    try {
      const response = await api.post(RECOVER_URL, resetData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error resetting password');
    }
  },

  
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  
  isAuthenticated: () => {
    const token = localStorage.getItem('authToken');
    return !!token;
  },

 
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};
