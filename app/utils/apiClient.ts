import axios from "axios";
import {
  getStorageItemAsync,
  setStorageItemAsync,
} from "../storage/useStorageState";
import { router } from "expo-router";

const baseURL = process.env.EXPO_PUBLIC_API_URL;
const apiClient = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});
const localApiClient = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

// Axios request interceptor
apiClient.interceptors.request.use(
  async (config) => {
    // Skip adding Authorization header for token refresh requests
    if (config.url === "/refreshToken" || config.url === "/accessToken") {
      return config;
    }

    // Set the Authorization header before the request is sent
    const authHeader = await getAuthHeader();
    config.headers.Authorization = authHeader;
    return config;
  },
  (error) => {
    // Handle errors in request setup
    return Promise.reject(error);
  }
);
// apiClient.interceptors.response.use(
//   async (config) => {
//     // Make it 200 range so things like 201 is also OK
//     if (config.status != 200) {
//       // If it's not in the 200 range we need to get a new accesToken and make the request again with the new token

//       // If the get new access token fails we need to signout the user by setting the token to null and then redirect to login page

//     }
//     return config;
//   }
// )
apiClient.interceptors.response.use(
  async (response) => {
    return response;
  },
  async (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      const originalRequest = error.config; // The original request that caused the error

      // If we haven't already tried to refresh the token
      if (!originalRequest._retry) {
        originalRequest._retry = true;

        const currentAccessToken = await getStorageItemAsync("token");

        if (currentAccessToken) {
          // Attempt to get a new access token using the refresh token
          const newAccessToken = await getNewAccessToken(currentAccessToken);

          if (newAccessToken) {
            originalRequest.headers["Authorization"] =
              getAuthHeaderFormat(newAccessToken);
            return localApiClient(originalRequest); // Retry the original request
          }
        }
      }

      // If refresh failed, log out the user and clear the token
      await setStorageItemAsync("token", null);
      console.error("Session expired or refresh failed. Logging out the user.");
      router.replace("/login");
      // Redirect to login or trigger logout UI
      //window.location.href = "/login"; // Or use a modal/other mechanism for logout
    }

    return Promise.reject(error);
  }
);

// Function to set the Authorization header
async function getAuthHeader(): Promise<string | undefined> {
  let token = await getStorageItemAsync("token");

  if (token) {
    if (isTokenExpired(token)) {
      const newToken = await getNewAccessToken(token); // Await the token
      return getAuthHeaderFormat(newToken);
    } else {
      return getAuthHeaderFormat(token);
    }
  } else {
    return undefined;
  }
}

// Function to check if the access token is expired
const isTokenExpired = (token: string): boolean => {
  try {
    // Split the token to get the payload
    const payloadBase64 = token.split(".")[1];
    const decodedPayload = JSON.parse(atob(payloadBase64));

    // Check if the `exp` field exists
    if (!decodedPayload.exp) {
      throw new Error("Token does not have an exp field");
    }

    // Compare `exp` with the current time (in seconds)
    const currentTime = Math.floor(Date.now() / 1000);
    return decodedPayload.exp < currentTime;
  } catch (error) {
    console.error("Invalid token:", error);
    return true; // Treat as expired if token is invalid
  }
};

const getNewAccessToken = async (
  expiredToken: string
): Promise<string | undefined> => {
  try {
    // Step 1: Call /refreshToken with the expired token in the Authorization header
    const refreshResponse = await localApiClient.get("/refreshToken", {
      headers: {
        Authorization: getAuthHeaderFormat(expiredToken),
      },
    });

    // Check if the response contains the refresh token
    const refreshToken = refreshResponse.data?.data?.refreshToken?.token;
    if (!refreshToken) {
      console.error("Failed to retrieve refresh token");
      return undefined;
    }

    // Step 2: Call /accessToken with the refresh token in the body
    const accessResponse = await localApiClient.post("/accessToken", {
      token: refreshToken,
    });

    // Check if the response contains the access token
    const accessToken = accessResponse.data?.data?.accessToken?.token;
    if (!accessToken) {
      console.error("Failed to retrieve access token");
      return undefined;
    }

    // Step 3: Save the new access token using setStorageItemAsync
    await setStorageItemAsync("token", accessToken);

    // Step 4: Return the new access token
    return accessToken;
  } catch (error) {
    console.error("Error while refreshing access token:", error);
    return undefined;
  }
};

const getAuthHeaderFormat = (token: string | undefined): string | undefined => {
  return token ? `Bearer ${token}` : undefined;
};

export default apiClient;
