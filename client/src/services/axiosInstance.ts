import axios from 'axios';
import { API_BASE_URL } from '../util/config';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
});

// 👉 Attach token to all requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 👉 Handle response errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    switch (status) {
      case 401:
        console.error('Unauthorized - maybe redirect to login.');
        // toast.error('Unauthorized! Please login.');
        break;
      case 404:
        console.error("Not Found - the resource doesn't exist.");
        // toast.warn('Resource not found.');
        break;
      case 500:
        console.error('Server Error - try again later.');
        // toast.error('Server error. Try again later.');
        break;
      default:
        console.error('Something went wrong.', error.message);
        // toast.error(error.message || 'An error occurred');
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
