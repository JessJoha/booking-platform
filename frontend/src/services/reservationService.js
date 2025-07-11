import api from './api';
import {
  RESERVATIONS_URL,
  DELETE_RESERVATIONS_URL,
  UPDATE_RESERVATIONS_URL,
  LIST_RESERVATIONS_URL
} from './api';

export const reservationService = {

  getAllReservations: async () => {
    try {
      const response = await api.get(LIST_RESERVATIONS_URL);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error getting reservations');
    }
  },


  createReservation: async (reservationData) => {
    try {
      const response = await api.post(RESERVATIONS_URL, reservationData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error creating reservation');
    }
  },


  updateReservation: async (reservationId, reservationData) => {
    try {
      const response = await api.put(`${UPDATE_RESERVATIONS_URL}/${reservationId}`, reservationData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error updating reservation');
    }
  },

  
  deleteReservation: async (reservationId) => {
    try {
      const response = await api.delete(`${DELETE_RESERVATIONS_URL}/${reservationId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error canceling reservation');
    }
  },
};
