import axios, { AxiosError } from "axios";
import type { InternalAxiosRequestConfig } from "axios";

type TokenGetter = () => string | null;

interface AuthHandlers {
  getRefreshToken: TokenGetter;
  onTokensRefreshed: (tokens: { accessToken: string; refreshToken: string }) => void;
  onSessionExpired: () => void;
}

let getAccessToken: TokenGetter = () => null;
let authHandlers: AuthHandlers = {
  getRefreshToken: () => null,
  onTokensRefreshed: () => undefined,
  onSessionExpired: () => undefined,
};

export const bindAccessTokenGetter = (getter: TokenGetter) => {
  getAccessToken = getter;
};

export const bindAuthHandlers = (handlers: AuthHandlers) => {
  authHandlers = handlers;
};

export const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL ?? "";
export const AUTH_BASE_URL = API_BASE_URL.replace(/\/v1\/?$/, "");

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise: Promise<string | null> | null = null;

const refreshAccessToken = async () => {
  const refreshToken = authHandlers.getRefreshToken();
  if (!refreshToken) return null;
  try {
    const response = await axios.post(`${AUTH_BASE_URL}/auth/refresh`, { token: refreshToken });
    const payload = response.data?.data;
    if (!payload?.accessToken) return null;
    authHandlers.onTokensRefreshed({
      accessToken: payload.accessToken,
      refreshToken: payload.refreshToken,
    });
    return payload.accessToken as string;
  } catch {
    return null;
  }
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;
    const requestUrl = String(originalRequest?.url ?? "");

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !requestUrl.includes("/auth/")
    ) {
      originalRequest._retry = true;
      refreshPromise = refreshPromise ?? refreshAccessToken();
      const newToken = await refreshPromise;
      refreshPromise = null;
      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      }
      if (getAccessToken()) authHandlers.onSessionExpired();
    }
    return Promise.reject(error);
  },
);

export const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined;
    if (data?.message) return data.message;
  }
  return fallback;
};

export default apiClient;
