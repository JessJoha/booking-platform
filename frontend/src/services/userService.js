import api from './api';
import {
  FIND_USER_URL,
  GET_BY_USER_URL,
  PROFILE_URL,
  UPDATE_PROFILE_URL
} from './api';

export const userService = {

  findUserByUsername: async (username) => {
    try {
      const encodedUsername = encodeURIComponent(username);
      const response = await api.get(`${FIND_USER_URL}/${encodedUsername}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error when searching for user');
    }
  },

  
  getUserById: async (username) => {
    try {
      const encodedUsername = encodeURIComponent(username);
      const response = await api.get(`${GET_BY_USER_URL}/${encodedUsername}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'User not found');
    }
  },

  
  getProfile: async () => {
    try {
      const response = await api.get(`${PROFILE_URL}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error getting profile');
    }
  },

 
  updateProfile: async (profileData) => {
    try {
      const response = await api.put(`${UPDATE_PROFILE_URL}/`, profileData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error updating profile');
    }
  },
};
