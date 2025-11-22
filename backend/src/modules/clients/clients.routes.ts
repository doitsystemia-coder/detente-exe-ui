import { Router } from 'express';
import { ClientType, Role } from '@prisma/client';

import { authenticate, authorizeRoles } from '../../middleware/authMiddleware.js';
import { clientsService } from './clients.service.js';

export const clientsRouter = Router();

clientsRouter.use(authenticate);

clientsRouter.get('/', async (_req, res, next) => {
  try {
    const clients = await clientsService.list();
    res.json(clients);
  } catch (err) {
    next(err);
  }
});

clientsRouter.post('/', authorizeRoles(Role.ADMIN, Role.MANAGER, Role.SALES), async (req, res, next) => {
  try {
    const { companyName, primaryContact, email, phone, address, type, notes } = req.body;
    const client = await clientsService.create({
      companyName,
      primaryContact,
      email,
      phone,
      address,
      type: (type as ClientType) || ClientType.PRO,
      notes
    });
    res.status(201).json(client);
  } catch (err) {
    next(err);
  }
});

clientsRouter.get('/:id', async (req, res, next) => {
  try {
    const client = await clientsService.get(req.params.id);
    res.json(client);
  } catch (err) {
    next(err);
  }
});

clientsRouter.put('/:id', authorizeRoles(Role.ADMIN, Role.MANAGER, Role.SALES), async (req, res, next) => {
  try {
    const client = await clientsService.update(req.params.id, req.body);
    res.json(client);
  } catch (err) {
    next(err);
  }
});

clientsRouter.delete('/:id', authorizeRoles(Role.ADMIN), async (req, res, next) => {
  try {
    await clientsService.remove(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});
