import { Role } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';

import { config } from '../../config/config.js';
import { AppError } from '../../core/errors.js';
import { prisma } from '../../core/prisma.js';
import { comparePassword, hashPassword } from '../../utils/password.js';
import { userService } from '../users/user.service.js';

export type RegisterInput = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: Role;
};

export class AuthService {
  async register(input: RegisterInput) {
    const existing = await userService.findByEmail(input.email);
    if (existing) throw new AppError('Email already in use', 409);
    const password = await hashPassword(input.password);
    const user = await userService.create({
      email: input.email,
      password,
      firstName: input.firstName,
      lastName: input.lastName,
      role: input.role || Role.MANAGER
    });
    return this.generateTokens(user.id, user.role);
  }

  async login(email: string, password: string) {
    const user = await userService.findByEmail(email);
    if (!user) throw new AppError('Invalid credentials', 401);
    const valid = await comparePassword(password, user.password);
    if (!valid) throw new AppError('Invalid credentials', 401);
    return this.generateTokens(user.id, user.role);
  }

  async refresh(token: string) {
    try {
      const payload = jwt.verify(token, config.jwtRefreshSecret) as { sub: string; jti: string; type: string };
      if (payload.type !== 'refresh') throw new AppError('Invalid token', 401);
      const stored = await prisma.refreshToken.findUnique({ where: { id: payload.jti } });
      if (!stored || stored.userId !== payload.sub) throw new AppError('Invalid token', 401);
      if (stored.expiresAt < new Date()) throw new AppError('Refresh token expired', 401);
      return this.generateTokens(payload.sub, (await userService.findById(payload.sub))!.role);
    } catch (err) {
      throw new AppError('Invalid refresh token', 401);
    }
  }

  private async generateTokens(userId: string, role: Role) {
    const accessToken = jwt.sign({ sub: userId, role, type: 'access' }, config.jwtAccessSecret, {
      expiresIn: config.accessTokenTtl
    });

    const tokenId = uuid();
    const refreshToken = jwt.sign({ sub: userId, jti: tokenId, type: 'refresh' }, config.jwtRefreshSecret, {
      expiresIn: `${config.refreshTokenTtlDays}d`
    });

    await prisma.refreshToken.create({
      data: {
        id: tokenId,
        userId,
        expiresAt: new Date(Date.now() + config.refreshTokenTtlDays * 24 * 60 * 60 * 1000)
      }
    });

    return { accessToken, refreshToken };
  }
}

export const authService = new AuthService();
