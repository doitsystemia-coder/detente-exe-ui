import { Router } from 'express';
import { Role } from '@prisma/client';

import { AppError } from '../../core/errors.js';
import { authenticate } from '../../middleware/authMiddleware.js';
import { authService } from './auth.service.js';

export const authRouter = Router();

authRouter.post('/register', async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;
    const tokens = await authService.register({
      email,
      password,
      firstName,
      lastName,
      role: role as Role
    });
    res.status(201).json(tokens);
  } catch (err) {
    next(err);
  }
});

authRouter.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const tokens = await authService.login(email, password);
    res.json(tokens);
  } catch (err) {
    next(err);
  }
});

authRouter.post('/refresh', async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw new AppError('Refresh token required', 400);
    const tokens = await authService.refresh(refreshToken);
    res.json(tokens);
  } catch (err) {
    next(err);
  }
});

authRouter.get('/me', authenticate, async (req, res, next) => {
  try {
    res.json({ user: req.user });
  } catch (err) {
    next(err);
  }
});
