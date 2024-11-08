import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../', '.env') });

const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT) || 3001,
  RATE_LIMIT_COUNT: Number(process.env.RATE_LIMIT_COUNT) || 500,
  RATE_LIMIT_RESET_MINUTES: Number(process.env.RATE_LIMIT_RESET_MINUTES) || 60,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || 'secret',
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || 'secret2',
  ACCESS_TOKEN_EXPIRATION: process.env.ACCESS_TOKEN_EXPIRATION || '5m',
  REFRESH_TOKEN_EXPIRATION: process.env.REFRESH_TOKEN_EXPIRATION || '3d',
  MAX_FAILED_LOGIN_ATTEMPTS: Number(process.env.MAX_FAILED_LOGIN_ATTEMPTS) || 5,
  ATTEMPT_WINDOW_MINUTES: Number(process.env.ATTEMPT_WINDOW_MINUTES) || 15,

  WHITELISTED_ORIGINS:
    process.env.WHITELISTED_ORIGINS ||
    'http://localhost:3000 http://localhost:3001 http://localhost:8081',
};

export default config;
