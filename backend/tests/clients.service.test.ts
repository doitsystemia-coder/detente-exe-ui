jest.mock('../src/core/prisma.js', () => ({
  prisma: {
    client: {
      findMany: jest.fn().mockResolvedValue([]),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    }
  }
}));

import { clientsService } from '../src/modules/clients/clients.service.js';
import { prisma } from '../src/core/prisma.js';

const client = {
  id: '123',
  companyName: 'Test',
  primaryContact: 'John',
  email: 'a@b.com',
  phone: null,
  address: null,
  type: 'PRO',
  notes: null,
  createdAt: new Date(),
  updatedAt: new Date()
};

describe('ClientsService', () => {
  beforeEach(() => jest.clearAllMocks());

  it('lists clients', async () => {
    (prisma.client.findMany as jest.Mock).mockResolvedValue([client]);
    const result = await clientsService.list();
    expect(result).toHaveLength(1);
  });

  it('throws on missing client', async () => {
    (prisma.client.findUnique as jest.Mock).mockResolvedValue(null);
    await expect(clientsService.get('missing')).rejects.toThrow('Client not found');
  });
});
