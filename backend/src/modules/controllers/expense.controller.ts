import type { Request, Response } from 'express';
import { STATUS_CODES } from '../../constants/statusCodes.js';
import { send } from '../../common/api.js';
import { addExpense, editExpense, getExpenses, removeExpense } from '../services/expense.service.js';
const userId = (req: Request): number => { if (!req.user) throw new Error('Missing authenticated user'); return req.user.id; };
export const listController = async (req: Request, res: Response) => send(res, STATUS_CODES.OK, await getExpenses(userId(req), req.query as never));
export const createController = async (req: Request, res: Response) => send(res, STATUS_CODES.CREATED, await addExpense(userId(req), req.body));
export const updateController = async (req: Request, res: Response) => send(res, STATUS_CODES.OK, await editExpense(userId(req), Number(req.params.id), req.body));
export const deleteController = async (req: Request, res: Response) => send(res, STATUS_CODES.OK, await removeExpense(userId(req), Number(req.params.id)));
