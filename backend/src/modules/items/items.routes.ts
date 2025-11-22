import { Router } from 'express';

import { authenticate } from '../../middleware/authMiddleware.js';
import { itemsService } from './items.service.js';

export const itemsRouter = Router();

itemsRouter.use(authenticate);

itemsRouter.get('/', async (_req, res, next) => {
  try {
    const items = await itemsService.list();
    res.json(items);
  } catch (err) {
    next(err);
  }
});
