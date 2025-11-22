import { Prisma } from '@prisma/client';

import { notFound } from '../../core/errors.js';
import { prisma } from '../../core/prisma.js';

export const projectsService = {
  list(filters: { status?: string; clientId?: string; managerId?: string }) {
    const where: Prisma.ProjectWhereInput = {};
    if (filters.status) where.status = filters.status as any;
    if (filters.clientId) where.clientId = filters.clientId;
    if (filters.managerId) where.managerId = filters.managerId;
    return prisma.project.findMany({
      where,
      include: { client: true, manager: true },
      orderBy: { createdAt: 'desc' }
    });
  },

  create(data: Prisma.ProjectCreateInput) {
    return prisma.project.create({ data });
  },

  async getWithTasks(id: string) {
    const project = await prisma.project.findUnique({
      where: { id },
      include: { tasks: true, client: true, manager: true }
    });
    if (!project) throw notFound('Project');
    return project;
  }
};
