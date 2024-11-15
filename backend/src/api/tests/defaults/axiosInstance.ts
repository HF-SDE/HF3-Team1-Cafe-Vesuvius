import axios from 'axios';
import https from 'https';

export const axiosInstance = axios.create({
  baseURL: 'https://localhost/api',
  httpsAgent: new https.Agent({
    rejectUnauthorized: false, // Allow self-signed certificates
  }),
});

export interface Response<T = any> {
  data: T;
}
