import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { errorHandler } from './middleware/errorHandler.js';
import { authRouter } from './modules/auth/auth.routes.js';
import { clientsRouter } from './modules/clients/clients.routes.js';
import { itemsRouter } from './modules/items/items.routes.js';
import { projectsRouter } from './modules/projects/projects.routes.js';
import { scheduleRouter } from './modules/schedule/schedule.routes.js';
import { ticketsRouter } from './modules/tickets/tickets.routes.js';

export const createApp = () => {
  const app = express();
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(morgan('dev'));

  app.use('/auth', authRouter);
  app.use('/clients', clientsRouter);
  app.use('/projects', projectsRouter);
  app.use('/schedule', scheduleRouter);
  app.use('/items', itemsRouter);
  app.use('/tickets', ticketsRouter);

  app.get('/health', (_req, res) => res.json({ status: 'ok' }));

  app.use(errorHandler);
  return app;
};
