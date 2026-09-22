import PDFDocument from 'pdfkit';
import { monthLabel } from '../../utils/date.utils.js';
import { monthlyTotals } from '../repositories/expense.repository.js';
import { reportRows } from '../repositories/report.repository.js';

export const getReport = async (userId: number, from: string, to: string) => ({ from, to, categories: await reportRows(userId, from, to) });
export const getMonthlySummary = async (userId: number, year: number) => {
  const totals = await monthlyTotals(userId, year);
  return Array.from({ length: 12 }, (_, index) => ({ month: monthLabel(`${year}-${String(index + 1).padStart(2, '0')}-01`), total: totals.find((item) => item.month === index + 1)?.total ?? 0 }));
};
export const createPdfReport = (title: string, rows: Array<{ category: string; total: number }>): PDFKit.PDFDocument => {
  const document = new PDFDocument({ margin: 48 });
  document.fontSize(22).fillColor('#17211b').text(title);
  document.moveDown().fontSize(10).fillColor('#66736a').text(`Generated ${new Date().toISOString().slice(0, 10)}`);
  document.moveDown();
  rows.forEach((row) => document.fontSize(12).fillColor('#17211b').text(`${row.category.padEnd(24, ' ')} ₹${row.total.toFixed(2)}`));
  return document;
};
