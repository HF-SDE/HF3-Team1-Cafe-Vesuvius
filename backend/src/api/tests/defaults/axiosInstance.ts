import axios from 'axios';
import https from 'https';

export const axiosInstance = axios.create({
  baseURL: process.env.VITE_API_URL,
  httpsAgent: new https.Agent({ rejectUnauthorized: false }),
});

export interface Response<T = any> {
  data: T;
}
