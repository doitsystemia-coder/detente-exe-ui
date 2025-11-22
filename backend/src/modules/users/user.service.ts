import { Role, User } from '@prisma/client';
import { prisma } from '../../core/prisma.js';

export type CreateUserInput = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: Role;
};

export const userService = {
  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  async findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },

  async create(data: CreateUserInput): Promise<User> {
    return prisma.user.create({ data });
  }
};
