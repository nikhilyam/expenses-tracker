import type { RowDataPacket } from 'mysql2';
import { db } from '../../config/db.config.js';
export const reportRows = async (userId: number, from: string, to: string): Promise<Array<{ category: string; total: number }>> => {
  const [rows] = await db.execute<RowDataPacket[]>('SELECT category, SUM(amount) AS total FROM expenses WHERE user_id = ? AND spent_at BETWEEN ? AND ? GROUP BY category ORDER BY total DESC', [userId, from, to]);
  return rows.map((row) => ({ 
    category: String(row.category), 
    total: Number(row.total) 
  }));
};
