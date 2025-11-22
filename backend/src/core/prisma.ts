import { PrismaClient } from '@prisma/client';

import { logger } from './logger.js';

export const prisma = new PrismaClient({
  log: ['warn', 'error']
});

prisma
  .$connect()
  .then(() => logger.info('Connected to database'))
  .catch((err) => logger.error({ err }, 'Failed to connect to database'));
