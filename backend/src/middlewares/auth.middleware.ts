import type { RequestHandler } from 'express';
import { ERROR_MESSAGES } from '../constants/errorMessages.js';
import { UnauthorizedError } from '../errors/index.js';
import { verifyToken } from '../helpers/auth.helpers.js';

export const requireAuth: RequestHandler = (req, _res, next) => {
  try {
    const header = req.header('authorization');
    if (!header?.startsWith('Bearer ')) throw new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
    req.user = verifyToken(header.slice(7));
    next();
  } catch {
    next(new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED));
  }
};
