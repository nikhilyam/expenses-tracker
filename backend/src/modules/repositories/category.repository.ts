import type { RowDataPacket } from 'mysql2';
import { db } from '../../config/db.config.js';
export const listCategories = async (userId: number): Promise<string[]> => {
  const [rows] = await db.execute<RowDataPacket[]>('SELECT DISTINCT category FROM expenses WHERE user_id = ? ORDER BY category', [userId]);
  return rows.map((row) => String(row.category));
};
