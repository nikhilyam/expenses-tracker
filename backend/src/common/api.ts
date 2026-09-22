import type { Response } from 'express';

export const send = <T>(res: Response, status: number, data: T): Response => res.status(status).json({ success: true, data });
