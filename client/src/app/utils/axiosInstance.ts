import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://hw-backend-2-1.onrender.com/api/v1/',
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
        config.headers['Content-Type'] = 'application/json';
      } else {
        console.warn('Token not found in localStorage');
      }
    } else {
      console.warn('window is undefined');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('Response error:', error.response);
    } else if (error.request) {
      console.error('Request error:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
