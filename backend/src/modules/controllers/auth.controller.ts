import type { Request, Response } from 'express';
import { STATUS_CODES } from '../../constants/statusCodes.js';
import { send } from '../../common/api.js';
import { login, register } from '../services/auth.service.js';
export const registerController = async (req: Request, res: Response) => send(res, STATUS_CODES.CREATED, await register(req.body.name, req.body.email, req.body.password));
export const loginController = async (req: Request, res: Response) => send(res, STATUS_CODES.OK, await login(req.body.email, req.body.password));
