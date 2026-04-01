import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Extend the Axios config type to include our custom _retry flag
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // Required to send/receive HttpOnly cookies
  headers: {
    'Content-Type': 'application/json',
    'accept-language': 'en',
    'platform': 'admin'
  },
});

api.interceptors.request.use((config) => {
  // Refresh must rely on the refresh-token cookie, not the access token.
  // Even if something else sets Authorization globally at runtime, strip it here.
  if (config.url?.includes('auth/refresh')) {
    config.withCredentials = true;
    const headers = config.headers as unknown as Record<string, unknown> | undefined;
    if (headers) {
      delete headers.Authorization;
      delete headers.authorization;
    }
  }
  return config;
});

let isRefreshing = false;
let failedQueue: { resolve: (value: unknown) => void; reject: (reason?: unknown) => void }[] = [];
let refreshFailed = false;
let isRedirectingToLogin = false;

const redirectToLoginOnce = () => {
  if (isRedirectingToLogin) return;
  isRedirectingToLogin = true;

  if (typeof window !== 'undefined') {
    window.location.assign('/login');
  }
};

/**
 * Handles the queue of requests that were paused while the token was being refreshed.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const processQueue = (error: any) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(null);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    const isAuthEndpoint =
      originalRequest.url?.includes('auth/login') ||
      originalRequest.url?.includes('auth/refresh');

    // 1. Check if the error is 401 and we haven't tried to refresh yet
    // 2. IMPORTANT: Don't try to refresh if the request was already to the refresh endpoint!
    if (
      error.response?.status === 401 && 
      !originalRequest._retry && 
      !isAuthEndpoint
    ) {

      // If refresh already failed, do not attempt it again. Just redirect and reject.
      if (refreshFailed) {
        redirectToLoginOnce();
        return Promise.reject(error);
      }
      
      if (isRefreshing) {
        // If a refresh is already in progress, wait for it to finish
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        /**
         * We call the refresh endpoint. 
         * The browser automatically attaches the 'refresh_token' cookie 
         * because it matches the /auth/refresh path.
         */
        await api.post(
          'auth/refresh',
          undefined,
          {
            withCredentials: true,
          },
        );

        // Refresh was successful, process the queued requests
        processQueue(null);
        
        // Re-run the original request
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed (RT is expired or revoked)
        refreshFailed = true;
        processQueue(refreshError);
        redirectToLoginOnce();
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);