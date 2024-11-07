/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

/* eslint-disable @typescript-eslint/no-unsafe-call */
import axios from 'axios';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const BASE_URL = 'http://localhost:3001'; // Replace with your actual base URL for the API

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3001', // Your base URL here
  validateStatus: () => true, // Allow all status codes
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

describe('Auth API Endpoints', () => {
  beforeAll(() => {
    // Any setup needed before tests run (e.g., ensuring server is running)
  });

  afterAll(() => {
    // Any cleanup needed after tests finish (e.g., shutting down the server)
  });
  it('should respond to /ping endpoint', async () => {
    const response = await axiosInstance.get(`${BASE_URL}/ping`);
    expect(response.status).toBe(200); // Ensure status is 200 OK
  });

  it('should login a user successfully', async () => {
    const response = await axiosInstance.post(`${BASE_URL}/login`, {
      username: 'admin',
      password: 'YWRtaW4=',
    });

    expect(response.status).toBe(200); // Validate successful login status
    expect(response.data).toHaveProperty('data');
    expect(response.data.data).toHaveProperty('accessToken');
    expect(response.data.data.accessToken).toHaveProperty('token');
    expect(response.data.data.accessToken).toHaveProperty('authType');
  });

  it('should return error for invalid login credentials', async () => {
    const response = await axiosInstance.post(`${BASE_URL}/login`, {
      username: 'admin',
      password: 'd3JvbmdwYXNzd29yZA==',
    });

    expect(response.status).toBe(401); // Validate unauthorized status
  });

  it('should return error for wrong password format', async () => {
    const response = await axiosInstance.post(`${BASE_URL}/login`, {
      username: 'admin',
      password: 'admin',
    });

    expect(response.status).toBe(400); // Validate unauthorized status
  });

  it('should login a user successfully and refresh tokens', async () => {
    // First, login to get the initial tokens
    const loginResponse = await axiosInstance.post(`${BASE_URL}/login`, {
      username: 'admin',
      password: 'YWRtaW4=', // Base64 encoded password (admin)
    });

    expect(loginResponse.status).toBe(200); // Validate successful login status
    expect(loginResponse.data).toHaveProperty('data');
    expect(loginResponse.data.data).toHaveProperty('accessToken');
    expect(loginResponse.data.data.accessToken).toHaveProperty('token');
    expect(loginResponse.data.data.accessToken).toHaveProperty('authType');

    const accessToken = loginResponse.data.data.accessToken.token;

    // Now call /refreshToken with the accessToken as a Bearer token in the Authorization header
    const refreshResponse = await axiosInstance.get(
      `${BASE_URL}/refreshToken`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Pass the access token as Bearer token
        },
      },
    );

    expect(refreshResponse.status).toBe(200); // Validate successful refresh response
    expect(refreshResponse.data).toHaveProperty('data');
    expect(refreshResponse.data.data).toHaveProperty('refreshToken');
    expect(refreshResponse.data.data.refreshToken).toHaveProperty('token');

    const newRefreshToken = refreshResponse.data.data.refreshToken.token;

    // Finally, call /accessToken with the new refresh token to get a new access token
    const accessTokenResponse = await axiosInstance.post(
      `${BASE_URL}/accessToken`,
      {
        token: newRefreshToken, // Pass the new refresh token to get a new access token
      },
    );

    expect(accessTokenResponse.status).toBe(200); // Validate successful access token response
    expect(loginResponse.data).toHaveProperty('data');
    expect(loginResponse.data.data).toHaveProperty('accessToken');
    expect(loginResponse.data.data.accessToken).toHaveProperty('token');
    expect(loginResponse.data.data.accessToken).toHaveProperty('authType');
  });

  it('should login a user successfully and refresh tokens multiple times', async () => {
    // First, login to get the initial tokens
    const loginResponse = await axiosInstance.post(`${BASE_URL}/login`, {
      username: 'admin',
      password: 'YWRtaW4=', // Base64 encoded password (admin)
    });

    expect(loginResponse.status).toBe(200); // Validate successful login status
    expect(loginResponse.data).toHaveProperty('data');
    expect(loginResponse.data.data).toHaveProperty('accessToken');
    expect(loginResponse.data.data.accessToken).toHaveProperty('token');
    expect(loginResponse.data.data.accessToken).toHaveProperty('authType');

    let accessToken = loginResponse.data.data.accessToken.token;

    // Loop to refresh and obtain new access tokens multiple times
    const iterations = 5; // Adjust the number of iterations as needed
    for (let i = 0; i < iterations; i++) {
      // Now call /refreshToken with the accessToken as a Bearer token in the Authorization header
      const refreshResponse = await axiosInstance.get(
        `${BASE_URL}/refreshToken`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Pass the access token as Bearer token
          },
        },
      );

      expect(refreshResponse.status).toBe(200); // Validate successful refresh response
      expect(refreshResponse.data).toHaveProperty('data');
      expect(refreshResponse.data.data).toHaveProperty('refreshToken');
      expect(refreshResponse.data.data.refreshToken).toHaveProperty('token');

      const newRefreshToken = refreshResponse.data.data.refreshToken.token;

      // Call /accessToken with the new refresh token to get a new access token
      const accessTokenResponse = await axiosInstance.post(
        `${BASE_URL}/accessToken`,
        {
          token: newRefreshToken, // Pass the new refresh token to get a new access token
        },
      );

      expect(accessTokenResponse.status).toBe(200); // Validate successful access token response
      expect(accessTokenResponse.data).toHaveProperty('data');
      expect(accessTokenResponse.data.data).toHaveProperty('accessToken');
      expect(accessTokenResponse.data.data.accessToken).toHaveProperty('token');
      expect(accessTokenResponse.data.data.accessToken).toHaveProperty(
        'authType',
      );

      // Update accessToken for the next iteration
      accessToken = accessTokenResponse.data.data.accessToken.token;
    }
  });

  it('should login a user successfully, use an expired access token to get a refresh token, and session should be removed', async () => {
    // Step 1: Login to get the initial tokens
    const loginResponse = await axiosInstance.post(`${BASE_URL}/login`, {
      username: 'admin',
      password: 'YWRtaW4=', // Base64 encoded password (admin)
    });

    expect(loginResponse.status).toBe(200); // Validate successful login status
    expect(loginResponse.data).toHaveProperty('data');
    expect(loginResponse.data.data).toHaveProperty('accessToken');
    expect(loginResponse.data.data.accessToken).toHaveProperty('token');
    expect(loginResponse.data.data.accessToken).toHaveProperty('authType');

    const initialAccessToken = loginResponse.data.data.accessToken.token;

    console.log(initialAccessToken);

    // Step 2: Call /refreshToken using the initial access token
    const refreshResponse = await axiosInstance.get(
      `${BASE_URL}/refreshToken`,
      {
        headers: {
          Authorization: `Bearer ${initialAccessToken}`, // Use the initial access token
        },
      },
    );

    expect(refreshResponse.status).toBe(200); // Validate successful refresh response
    expect(refreshResponse.data).toHaveProperty('data');
    expect(refreshResponse.data.data).toHaveProperty('refreshToken');
    expect(refreshResponse.data.data.refreshToken).toHaveProperty('token');

    const newRefreshToken = refreshResponse.data.data.refreshToken.token;

    console.log(newRefreshToken);

    // Step 3: Use the new refresh token to obtain a new access token
    const accessTokenResponse = await axiosInstance.post(
      `${BASE_URL}/accessToken`,
      {
        token: newRefreshToken, // Pass the new refresh token to get a new access token
      },
    );

    expect(accessTokenResponse.status).toBe(200); // Validate successful access token response

    const newAccessToken = accessTokenResponse.data.data.accessToken.token;

    console.log(initialAccessToken);

    await sleep(2000); // wait for 1 second

    // Step 4: Attempt to use the initial access token with /refreshToken, expecting it to fail
    const refreshResponse2 = await axiosInstance
      .get(`${BASE_URL}/refreshToken`, {
        headers: {
          Authorization: `Bearer ${initialAccessToken}`, // Use the old access token
        },
      })
      .catch((error) => error.response);

    expect(refreshResponse2.status).toBe(401); // Validate 401 Unauthorized response
  });
});
