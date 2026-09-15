import axios from "axios";

type TokenGetter = () => string | null;

let getAccessToken: TokenGetter = () => null;

export const bindAccessTokenGetter = (getter: TokenGetter) => {
  getAccessToken = getter;
};

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
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
  },
);

export default apiClient;
