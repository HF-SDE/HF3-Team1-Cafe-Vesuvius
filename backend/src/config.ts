import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../', '.env') });

const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT) || 3001,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || 'secret',
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || 'secret2',
  WHITELISTED_ORIGINS:
  process.env.WHITELISTED_ORIGINS || "http://localhost:3000 http://localhost:3001 http://localhost:8081",
};

export default config;
