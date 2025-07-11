import axios from 'axios';


export const LOGIN_URL = process.env.REACT_APP_LOGIN_URL;
export const REGISTER_URL = process.env.REACT_APP_REGISTER_URL;
export const RECOVER_URL = process.env.REACT_APP_RECOVER_URL;
export const SEND_CODE_URL = process.env.REACT_APP_SEND_CODE_URL;

export const FIND_USER_URL = process.env.REACT_APP_FIND_USER_URL;
export const GET_BY_USER_URL = process.env.REACT_APP_GET_BY_USER_URL;
export const PROFILE_URL = process.env.REACT_APP_PROFILE_URL;
export const UPDATE_PROFILE_URL = process.env.REACT_APP_UPDATE_PROFILE_URL;

export const RESERVATIONS_URL = process.env.REACT_APP_RESERVATIONS_URL;
export const DELETE_RESERVATIONS_URL = process.env.REACT_APP_DELETE_RESERVATIONS_URL;
export const UPDATE_RESERVATIONS_URL = process.env.REACT_APP_UPDATE_RESERVATIONS_URL;
export const LIST_RESERVATIONS_URL = process.env.REACT_APP_LIST_RESERVATIONS_URL;

export const SPACES_URL = process.env.REACT_APP_SPACES_URL;
export const DELETE_SPACES_URL = process.env.REACT_APP_DELETE_SPACES_URL;
export const UPDATE_SPACES_URL = process.env.REACT_APP_UPDATE_SPACES_URL;
export const LIST_SPACES_URL = process.env.REACT_APP_LIST_SPACES_URL;

export const REPORTS_USER_URL = process.env.REACT_APP_REPORTS_USER_URL;
export const OCCUPANCY_URL = process.env.REACT_APP_OCCUPANCY_URL;


export const authHeader = () => {
  const token = localStorage.getItem('authToken');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};


const api = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default api;
