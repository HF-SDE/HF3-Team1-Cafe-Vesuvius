import axios from "axios";
import {
  getStorageItemAsync,
  setStorageItemAsync,
} from "../storage/useStorageState";

const apiClient = axios.create({
  baseURL: "https://localhost/api",
  withCredentials: true,
});

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

// Axios request interceptor
apiClient.interceptors.request.use(
  async (config) => {
    // Skip adding Authorization header for token refresh requests
    console.log(config.url);

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
    const refreshResponse = await apiClient.get("/refreshToken", {
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
    const accessResponse = await apiClient.post("/accessToken", {
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
