import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../', '.env') });

const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3001,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  WHITELISTED_ORIGINS:
    process.env.WHITELISTED_ORIGINS || 'localhost:3000 localhost:3001',
};

export default config;