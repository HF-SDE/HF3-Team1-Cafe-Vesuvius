import axios from "axios";
import {
  getStorageItemAsync,
  setStorageItemAsync,
} from "../hooks/useStorageState";
import { router } from "expo-router";

const baseURL = process.env.EXPO_PUBLIC_API_URL;
const apiClient = axios.create({
  baseURL: baseURL,
  headers: {
    "ngrok-skip-browser-warning": "69420",
  },
});
const localApiClient = axios.create({
  baseURL: baseURL,
  headers: {
    "ngrok-skip-browser-warning": "69420",
  },
});

// Shared flag to track token refresh
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Add request interceptor
apiClient.interceptors.request.use(
  async (config) => {
    try {
      if (config.url === "/refreshToken" || config.url === "/accessToken") {
        return config;
      }

      const authHeader = await getAuthHeader();
      if (authHeader) {
        config.headers.Authorization = authHeader;
      }
    } catch {
      await setStorageItemAsync("token", null);
      router.replace("/login");
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor
apiClient.interceptors.response.use(
  async (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check for 401 or 403 errors
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      if (!originalRequest._retry) {
        originalRequest._retry = true;

        if (!isRefreshing) {
          isRefreshing = true;

          try {
            const newToken = await refreshAccessToken();

            // Notify all subscribers with the new token
            refreshSubscribers.forEach((callback) => callback(newToken));
            refreshSubscribers = []; // Clear the subscribers
            isRefreshing = false;

            // Retry the original request with the new token
            originalRequest.headers.Authorization =
              getAuthHeaderFormat(newToken);
            return apiClient(originalRequest);
          } catch {
            isRefreshing = false;
            await setStorageItemAsync("token", null);
            router.replace("/login");
          }
        }

        // If a refresh is already in progress, queue the request
        return new Promise((resolve, reject) => {
          refreshSubscribers.push((newToken: string) => {
            originalRequest.headers.Authorization =
              getAuthHeaderFormat(newToken);
            resolve(apiClient(originalRequest));
          });
        });
      }
    }

    return Promise.reject(error);
  }
);

// Helper functions
async function getAuthHeader(): Promise<string | undefined> {
  const token = await getStorageItemAsync("token");
  if (token && !isTokenExpired(token)) {
    return getAuthHeaderFormat(token);
  }
  if (token) {
    return getAuthHeaderFormat(await refreshAccessToken());
  }
  throw new Error("No token available");
}

async function refreshAccessToken(): Promise<string> {
  const token = await getStorageItemAsync("token");
  if (!token) throw new Error("No token available for refresh");

  const refreshResponse = await localApiClient.get("/refreshToken", {
    headers: {
      Authorization: getAuthHeaderFormat(token),
    },
  });
  const refreshToken = refreshResponse.data?.data?.refreshToken?.token;
  if (!refreshToken) throw new Error("Failed to get refresh token");

  const accessResponse = await localApiClient.post("/accessToken", {
    token: refreshToken,
  });
  const newAccessToken = accessResponse.data?.data?.accessToken?.token;
  if (!newAccessToken) throw new Error("Failed to get access token");

  await setStorageItemAsync("token", newAccessToken);
  return newAccessToken;
}

const getAuthHeaderFormat = (token: string | undefined): string | undefined => {
  return token ? `Bearer ${token}` : undefined;
};

const isTokenExpired = (token: string): boolean => {
  const payloadBase64 = token.split(".")[1];
  const decodedPayload = JSON.parse(atob(payloadBase64));
  const currentTime = Math.floor(Date.now() / 1000);
  return decodedPayload.exp < currentTime;
};

export default apiClient;
