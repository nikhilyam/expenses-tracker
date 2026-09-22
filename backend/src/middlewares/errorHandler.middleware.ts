import type { ErrorRequestHandler } from 'express';
import { AppError } from '../errors/AppError.js';
import { ERROR_MESSAGES } from '../constants/errorMessages.js';
import { STATUS_CODES } from '../constants/statusCodes.js';
import { logger } from '../logger/pino.logger.js';

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  const appError = error instanceof AppError ? error : new AppError(STATUS_CODES.INTERNAL_SERVER_ERROR, ERROR_MESSAGES.INTERNAL_ERROR);
  if (! (error instanceof AppError)) logger.error({ error }, 'Unhandled request error');
  res.status(appError.statusCode).json({ success: false, message: appError.message, details: appError.details });
};
