import { prisma } from '../../core/prisma.js';

export const itemsService = {
  list() {
    return prisma.item.findMany({ orderBy: { name: 'asc' } });
  }
};
