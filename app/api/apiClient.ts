// src/apiClient.ts
import axios from 'axios';
import { useStorageState } from '../storage/useStorageState';

const apiClient = axios.create({
  baseURL: "http://localhost:3001",
});

// Function to check if the access token is expired
const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return Date.now() >= payload.exp * 1000;
  } catch (error) {
    console.error('Error decoding token:', error);
    return true;
  }
};

// Function to refresh the token
export const getNewToken = async (session: string, setSession: any): Promise<void> => {
  try {
    const response = await apiClient.get('/refreshToken', {
      headers: { 'Authorization': `Bearer ${session}` },
    });

    if (response.status !== 200) {
      throw new Error('Failed to refresh token, status: ' + response.status);
    }

    const { newRefreshToken } = response.data;

    const accessTokenResponse = await apiClient.post('/accessToken', {
      refreshToken: newRefreshToken,
    });

    if (accessTokenResponse.status !== 200) {
      throw new Error('Failed to get access token, status: ' + accessTokenResponse.status);
    }

    const { accessToken } = accessTokenResponse.data;

    // Save the new access token via setSession
    setSession(accessToken);
  } catch (error: any) {
    console.error('Error in getNewToken:', error.message || error);
    throw error;
  }
};

// Create a custom hook for using the apiClient
export const useApiClient = () => {
  const [[isLoading, session], setSession] = useStorageState("session");

  // Axios request interceptor
  apiClient.interceptors.request.use(async (config) => {
    if (isTokenExpired(session)) {
      console.log("Access token is expired");

      try {
        if (!session){
          throw new Error("No session")          
        }
        await getNewToken(session, setSession);
        config.headers['Authorization'] = `Bearer ${session}`;
      } catch (refreshError) {
        console.error("Failed to refresh token", refreshError);
        return Promise.reject(refreshError);
      }
    } else {
      config.headers['Authorization'] = `Bearer ${session}`;
    }

    return config;
  });

  // Axios response interceptor
  apiClient.interceptors.response.use(
    response => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response && error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          if (!session){
            throw new Error("No session")          
          }
          await getNewToken(session, setSession);
          apiClient.defaults.headers['Authorization'] = `Bearer ${session}`;
          originalRequest.headers['Authorization'] = `Bearer ${session}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          console.error("Failed to refresh token", refreshError);
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return apiClient;
};
export default apiClient;
