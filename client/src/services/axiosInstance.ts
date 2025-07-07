import axios from 'axios';
import { API_BASE_URL } from '../util/config';
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
});

axiosInstance.interceptors.response.use(
  (response) =>  response ,
  (error) => {  
    const status = error.response?.status;

    switch (status) {
      case 401:
        console.error("Unauthorized - maybe redirect to login.");
        break;
      case 404:
        console.error("Not Found - the resource doesn't exist.");
        break;
      case 500:
        console.error("Server Error - try again later.");
        break;
      default:
        console.error("Something went wrong.", error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
