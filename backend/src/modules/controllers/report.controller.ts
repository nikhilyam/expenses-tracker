import type { Request, Response } from 'express';
import { STATUS_CODES } from '../../constants/statusCodes.js';
import { send } from '../../common/api.js';
import { createPdfReport, getMonthlySummary, getReport } from '../services/report.service.js';
export const reportController = async (req: Request, res: Response) => send(res, STATUS_CODES.OK, await getReport(req.user!.id, String(req.query.from), String(req.query.to)));
export const monthlyController = async (req: Request, res: Response) => send(res, STATUS_CODES.OK, await getMonthlySummary(req.user!.id, Number(req.query.year)));
export const pdfController = async (req: Request, res: Response) => {
  const report = await getReport(req.user!.id, String(req.query.from), String(req.query.to));
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="expense-report.pdf"');
  createPdfReport(`Expense report: ${report.from} to ${report.to}`, report.categories).pipe(res);
};
