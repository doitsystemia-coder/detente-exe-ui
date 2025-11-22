import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const requiredEnv = ['DATABASE_URL', 'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'];

const missing = requiredEnv.filter((key) => !process.env[key]);
if (missing.length) {
  // Soft warning to help developers during setup
  // eslint-disable-next-line no-console
  console.warn(`Missing environment variables: ${missing.join(', ')}`);
}

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 4000,
  databaseUrl: process.env.DATABASE_URL || '',
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || 'access_secret',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'refresh_secret',
  accessTokenTtl: '15m',
  refreshTokenTtlDays: 30
};
