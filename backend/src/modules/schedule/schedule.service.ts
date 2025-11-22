import { Prisma } from '@prisma/client';

import { prisma } from '../../core/prisma.js';

export const scheduleService = {
  list(filters: { userId?: string; startDate?: string; endDate?: string }) {
    const where: Prisma.EventWhereInput = {};
    if (filters.userId) where.userId = filters.userId;
    if (filters.startDate || filters.endDate) {
      where.startDate = {};
      if (filters.startDate) where.startDate.gte = new Date(filters.startDate);
      if (filters.endDate) where.startDate.lte = new Date(filters.endDate);
    }
    return prisma.event.findMany({ where, include: { project: true, user: true }, orderBy: { startDate: 'asc' } });
  },

  create(data: Prisma.EventCreateInput) {
    return prisma.event.create({ data });
  }
};
