import { Router } from 'express';
import { Role } from '@prisma/client';

import { authenticate, authorizeRoles } from '../../middleware/authMiddleware.js';
import { projectsService } from './projects.service.js';

export const projectsRouter = Router();

projectsRouter.use(authenticate);

projectsRouter.get('/', async (req, res, next) => {
  try {
    const { status, clientId, managerId } = req.query;
    const projects = await projectsService.list({
      status: status as string,
      clientId: clientId as string,
      managerId: managerId as string
    });
    res.json(projects);
  } catch (err) {
    next(err);
  }
});

projectsRouter.post('/', authorizeRoles(Role.ADMIN, Role.MANAGER), async (req, res, next) => {
  try {
    const project = await projectsService.create(req.body);
    res.status(201).json(project);
  } catch (err) {
    next(err);
  }
});

projectsRouter.get('/:id', async (req, res, next) => {
  try {
    const project = await projectsService.getWithTasks(req.params.id);
    res.json(project);
  } catch (err) {
    next(err);
  }
});
