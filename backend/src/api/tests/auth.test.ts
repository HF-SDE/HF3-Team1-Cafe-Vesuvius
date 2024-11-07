/* eslint-disable func-style */

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

/* eslint-disable @typescript-eslint/no-unsafe-call */
import axios from 'axios';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const BASE_URL = 'http://localhost:3001';
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  validateStatus: () => true,
});

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper function for login request
const loginUser = async (username: string, password: string) => {
  return await axiosInstance.post('/login', { username, password });
};

// Helper function for checking login success response structure
const validateLoginSuccess = (response: any) => {
  expect(response.status).toBe(200);
  expect(response.data).toHaveProperty('data');
  expect(response.data.data).toHaveProperty('accessToken');
  expect(response.data.data.accessToken).toHaveProperty('token');
  expect(response.data.data.accessToken).toHaveProperty('authType');
};

// Helper function for refreshing token
const refreshToken = async (accessToken: string) => {
  return await axiosInstance.get('/refreshToken', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

// Helper function for requesting new access token using refresh token
const getNewAccessToken = async (refreshToken: string) => {
  return await axiosInstance.post('/accessToken', { token: refreshToken });
};

describe('Auth API Endpoints', () => {
  beforeAll(() => {
    // Any setup needed before tests run
  });

  afterAll(() => {
    // Any cleanup needed after tests finish
  });

  it('should respond to /ping endpoint', async () => {
    const response = await axiosInstance.get('/ping');
    expect(response.status).toBe(200);
  });

  it('should login a user successfully', async () => {
    const response = await loginUser('admin', 'YWRtaW4=');
    validateLoginSuccess(response);
  });

  it('should return error for invalid login credentials (valid Base64, wrong password)', async () => {
    const response = await loginUser('admin', 'd3JvbmdwYXNzd29yZA==');
    expect(response.status).toBe(401); // Unauthorized
  });

  it('should return error for wrong password format (not Base64)', async () => {
    const response = await loginUser('admin', 'admin');
    expect(response.status).toBe(400); // Bad Request due to wrong format
  });
  it('should return error for wrong password', async () => {
    const response = await loginUser('admin', 'd3JvbmdwYXNzd29yZA==');
    expect(response.status).toBe(401); // Bad Request due to wrong format
  });

  it('should login a user, refresh tokens, and obtain new access token', async () => {
    const loginResponse = await loginUser('admin', 'YWRtaW4=');
    validateLoginSuccess(loginResponse);

    const initialAccessToken = loginResponse.data.data.accessToken.token;
    const refreshResponse = await refreshToken(initialAccessToken);
    expect(refreshResponse.status).toBe(200);
    expect(refreshResponse.data.data).toHaveProperty('refreshToken');

    const newRefreshToken = refreshResponse.data.data.refreshToken.token;
    const accessTokenResponse = await getNewAccessToken(newRefreshToken);
    expect(accessTokenResponse.status).toBe(200);
    validateLoginSuccess(accessTokenResponse);
  });

  it('should login a user, refresh tokens multiple times', async () => {
    const loginResponse = await loginUser('admin', 'YWRtaW4=');
    validateLoginSuccess(loginResponse);

    let accessToken = loginResponse.data.data.accessToken.token;
    const iterations = 5;
    for (let i = 0; i < iterations; i++) {
      const refreshResponse = await refreshToken(accessToken);
      expect(refreshResponse.status).toBe(200);
      const newRefreshToken = refreshResponse.data.data.refreshToken.token;

      const accessTokenResponse = await getNewAccessToken(newRefreshToken);
      expect(accessTokenResponse.status).toBe(200);
      accessToken = accessTokenResponse.data.data.accessToken.token;
    }
  });

  it('should expire initial access token after refresh and invalidate session', async () => {
    const loginResponse = await loginUser('admin', 'YWRtaW4=');
    await sleep(500);
    validateLoginSuccess(loginResponse);
    const initialAccessToken = loginResponse.data.data.accessToken.token;

    const refreshResponse = await refreshToken(initialAccessToken);
    await sleep(500);
    expect(refreshResponse.status).toBe(200);
    const newRefreshToken = refreshResponse.data.data.refreshToken.token;

    const accessTokenResponse = await getNewAccessToken(newRefreshToken);
    await sleep(500);
    expect(accessTokenResponse.status).toBe(200);

    const retryRefresh = await refreshToken(initialAccessToken);
    await sleep(500);
    expect(retryRefresh.status).toBe(401); // Initial token expired, unauthorized
  });

  it('should fail to use expired refresh token for access token', async () => {
    const loginResponse = await loginUser('admin', 'YWRtaW4=');
    await sleep(500);
    validateLoginSuccess(loginResponse);

    const initialAccessToken = loginResponse.data.data.accessToken.token;
    const refreshResponse = await refreshToken(initialAccessToken);
    await sleep(500);
    expect(refreshResponse.status).toBe(200);
    const newRefreshToken = refreshResponse.data.data.refreshToken.token;

    const accessTokenResponse = await getNewAccessToken(newRefreshToken);
    await sleep(500);
    expect(accessTokenResponse.status).toBe(200);

    // Attempt to reuse the expired refresh token
    const retryAccessTokenResponse = await getNewAccessToken(newRefreshToken);
    await sleep(500);
    expect(retryAccessTokenResponse.status).toBe(401); // Unauthorized due to expired token
  });
});
