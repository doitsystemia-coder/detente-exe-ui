import pino from 'pino';

import { config } from '../config/config.js';

export const logger = pino({
  transport: config.nodeEnv === 'development'
    ? { target: 'pino-pretty', options: { colorize: true, translateTime: 'SYS:standard' } }
    : undefined,
  level: config.nodeEnv === 'development' ? 'debug' : 'info'
});
