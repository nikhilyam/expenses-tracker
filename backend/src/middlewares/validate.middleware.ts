import type { RequestHandler } from 'express';
import type Joi from 'joi';
import { BadRequestError } from '../errors/index.js';
import { ERROR_MESSAGES } from '../constants/errorMessages.js';

export const validate = (schema: Joi.ObjectSchema, source: 'body' | 'query' | 'params' = 'body'): RequestHandler => (req, _res, next) => {
  const { error, value } = schema.validate(req[source], { abortEarly: false, stripUnknown: true });
  if (error) return next(new BadRequestError(ERROR_MESSAGES.VALIDATION_FAILED, error.details.map((detail) => detail.message)));
  req[source] = value;
  next();
};
