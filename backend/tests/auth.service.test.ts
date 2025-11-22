import { Role } from '@prisma/client';
import jwt from 'jsonwebtoken';

jest.mock('../src/modules/users/user.service.js', () => ({
  userService: {
    findByEmail: jest.fn(),
    findById: jest.fn(),
    create: jest.fn()
  }
}));

jest.mock('../src/core/prisma.js', () => ({
  prisma: {
    refreshToken: {
      create: jest.fn(),
      findUnique: jest.fn()
    }
  }
}));

import { authService } from '../src/modules/auth/auth.service.js';
import { userService } from '../src/modules/users/user.service.js';
import { prisma } from '../src/core/prisma.js';

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('registers a new user and returns tokens', async () => {
    (userService.findByEmail as jest.Mock).mockResolvedValue(null);
    (userService.create as jest.Mock).mockResolvedValue({ id: '1', role: Role.MANAGER });
    (prisma.refreshToken.create as jest.Mock).mockResolvedValue({});

    const tokens = await authService.register({
      email: 'test@example.com',
      password: 'secret',
      firstName: 'Test',
      lastName: 'User'
    });

    expect(tokens.accessToken).toBeDefined();
    expect(tokens.refreshToken).toBeDefined();
    const decoded = jwt.decode(tokens.accessToken) as any;
    expect(decoded.sub).toBe('1');
  });

  it('rejects duplicate emails', async () => {
    (userService.findByEmail as jest.Mock).mockResolvedValue({ id: '1' });
    await expect(
      authService.register({ email: 'dup@example.com', password: 'x', firstName: 'A', lastName: 'B' })
    ).rejects.toThrow('Email already in use');
  });
});
