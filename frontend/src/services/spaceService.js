import api from './api';
import {
  SPACES_URL,
  DELETE_SPACES_URL,
  UPDATE_SPACES_URL,
  LIST_SPACES_URL
} from './api';

export const spaceService = {

  getAllSpaces: async () => {
    try {
      const response = await api.get(LIST_SPACES_URL);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error getting spaces');
    }
  },


  getSpaceById: async (spaceId) => {
    try {
      const response = await api.get(`${LIST_SPACES_URL}/${spaceId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Space not found');
    }
  },

 
  createSpace: async (spaceData) => {
    try {
      const response = await api.post(SPACES_URL, spaceData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error creating space');
    }
  },


  updateSpace: async (spaceId, spaceData) => {
    try {
      const response = await api.put(`${UPDATE_SPACES_URL}/${spaceId}`, spaceData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error updating space');
    }
  },


  deleteSpace: async (spaceId) => {
    try {
      const response = await api.delete(`${DELETE_SPACES_URL}/${spaceId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error deleting space');
    }
  },


  searchSpaces: async (filters) => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await api.get(`${LIST_SPACES_URL}/search?${queryParams}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error searching for spaces');
    }
  },
};
