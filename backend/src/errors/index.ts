import { STATUS_CODES } from '../constants/statusCodes.js';
import { AppError } from './AppError.js';

export class BadRequestError extends AppError {
  constructor(message: string, details?: unknown) { 
    super(STATUS_CODES.BAD_REQUEST, message, details); 
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string) { 
    super(STATUS_CODES.UNAUTHORIZED, message); 
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) { 
    super(STATUS_CODES.NOT_FOUND, message); 
  }
}

export class ConflictError extends AppError {
  constructor(message: string) { 
    super(STATUS_CODES.CONFLICT, message); 
  }
}
