/* eslint-disable jsdoc/require-jsdoc */
import { axiosInstance } from './axiosInstance';

export async function login(): Promise<string> {
  const response = await axiosInstance.post<{
    data: { accessToken: { token: string } };
  }>('/login', {
    username: 'admin',
    password: 'YWRtaW4=',
  });

  const token = response.data.data.accessToken.token;

  axiosInstance.defaults.headers.Authorization = `Bearer ${token}`;

  return token;
}

export async function logout(): Promise<void> {
  const authHeader = axiosInstance.defaults.headers.Authorization;

  if (!authHeader) return;
  if (typeof authHeader !== 'string') return;
  if (!authHeader.startsWith('Bearer ')) return;

  const token = authHeader.split(' ')[1];

  await axiosInstance.post('/logout', { token });
}
