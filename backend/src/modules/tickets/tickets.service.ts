import { Prisma } from '@prisma/client';

import { prisma } from '../../core/prisma.js';

export const ticketsService = {
  list() {
    return prisma.ticket.findMany({ include: { client: true, project: true, technician: true } });
  },

  create(data: Prisma.TicketCreateInput) {
    return prisma.ticket.create({ data });
  }
};
