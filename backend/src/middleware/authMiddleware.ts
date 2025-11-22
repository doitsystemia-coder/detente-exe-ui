import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { config } from '../config/config.js';
import { AppError } from '../core/errors.js';

export interface AuthenticatedRequest extends Request {
  user?: { id: string; role: string };
}

export function authenticate(req: AuthenticatedRequest, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header) return next(new AppError('Missing Authorization header', 401));
  const [, token] = header.split(' ');
  try {
    const payload = jwt.verify(token, config.jwtAccessSecret) as { sub: string; role: string };
    req.user = { id: payload.sub, role: payload.role };
    return next();
  } catch (err) {
    return next(new AppError('Invalid or expired token', 401));
  }
}

export function authorizeRoles(...roles: string[]) {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    if (!req.user) return next(new AppError('Unauthorized', 401));
    if (!roles.includes(req.user.role)) return next(new AppError('Forbidden', 403));
    return next();
  };
}
