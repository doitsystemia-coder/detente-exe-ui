import { Client, ClientType } from '@prisma/client';

import { notFound } from '../../core/errors.js';
import { prisma } from '../../core/prisma.js';

export type ClientInput = Omit<Client, 'id' | 'createdAt' | 'updatedAt' | 'projects' | 'tickets'>;

export const clientsService = {
  list() {
    return prisma.client.findMany({ orderBy: { createdAt: 'desc' } });
  },

  create(data: ClientInput) {
    return prisma.client.create({ data });
  },

  async get(id: string) {
    const client = await prisma.client.findUnique({ where: { id } });
    if (!client) throw notFound('Client');
    return client;
  },

  async update(id: string, data: Partial<ClientInput>) {
    await this.get(id);
    return prisma.client.update({ where: { id }, data });
  },

  async remove(id: string) {
    await this.get(id);
    return prisma.client.delete({ where: { id } });
  }
};
