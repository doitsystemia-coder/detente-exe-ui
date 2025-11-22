import { NextFunction, Request, Response } from 'express';

import { AppError } from '../core/errors.js';
import { logger } from '../core/logger.js';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  const status = err instanceof AppError ? err.status : 500;
  logger.error({ err }, 'Unhandled error');
  res.status(status).json({ message: err.message || 'Internal server error' });
}
