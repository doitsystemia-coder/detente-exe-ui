import { Router } from 'express';
import { Role } from '@prisma/client';

import { authenticate, authorizeRoles } from '../../middleware/authMiddleware.js';
import { ticketsService } from './tickets.service.js';

export const ticketsRouter = Router();

ticketsRouter.use(authenticate);

ticketsRouter.get('/', async (_req, res, next) => {
  try {
    const tickets = await ticketsService.list();
    res.json(tickets);
  } catch (err) {
    next(err);
  }
});

ticketsRouter.post('/', authorizeRoles(Role.ADMIN, Role.MANAGER, Role.TECH, Role.SALES), async (req, res, next) => {
  try {
    const ticket = await ticketsService.create(req.body);
    res.status(201).json(ticket);
  } catch (err) {
    next(err);
  }
});
