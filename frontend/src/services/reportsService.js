import api from './api';
import { REPORTS_USER_URL, OCCUPANCY_URL } from './api';

export const reportsService = {

  getUserReports: async (username) => {
    try {
      const encodedUsername = encodeURIComponent(username);
      const response = await api.get(`${REPORTS_USER_URL}/${encodedUsername}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error getting user reports');
    }
  },

  getOccupancyReports: async () => {
    try {
      const response = await api.get(`${OCCUPANCY_URL}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error getting occupancy reports');
    }
  },

};
