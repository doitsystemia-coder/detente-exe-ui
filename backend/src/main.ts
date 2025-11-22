import { config } from './config/config.js';
import { logger } from './core/logger.js';
import { createApp } from './app.js';

const app = createApp();

app.listen(config.port, () => {
  logger.info(`Server running on port ${config.port}`);
});
