import axios from 'axios';
import { store } from '../store';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
});

apiClient.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
        // Implement refresh logic here if needed, or redirect to login
    }
    return Promise.reject(error);
  }
);

export default apiClient;
