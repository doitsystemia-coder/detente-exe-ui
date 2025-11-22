import { Router } from 'express';
import { Role } from '@prisma/client';

import { authenticate, authorizeRoles } from '../../middleware/authMiddleware.js';
import { scheduleService } from './schedule.service.js';

export const scheduleRouter = Router();

scheduleRouter.use(authenticate);

scheduleRouter.get('/', async (req, res, next) => {
  try {
    const { userId, startDate, endDate } = req.query;
    const events = await scheduleService.list({
      userId: userId as string,
      startDate: startDate as string,
      endDate: endDate as string
    });
    res.json(events);
  } catch (err) {
    next(err);
  }
});

scheduleRouter.post('/', authorizeRoles(Role.ADMIN, Role.MANAGER), async (req, res, next) => {
  try {
    const event = await scheduleService.create(req.body);
    res.status(201).json(event);
  } catch (err) {
    next(err);
  }
});
