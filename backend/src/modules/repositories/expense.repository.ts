import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import { db } from '../../config/db.config.js';
import type { Expense, ExpenseFilters } from '../../common/types.js';
import { offsetFor } from '../../utils/pagination.utils.js';

interface ExpenseRow extends RowDataPacket {
  id: number;
  user_id: number;
  amount: number;
  category: string;
  description: string;
  spent_at: string;
  created_at: string;
}
type SqlValue = string | number;

const conditions = (userId: number, filters: ExpenseFilters): { sql: string; params: SqlValue[] } => {
  const clauses = ['user_id = ?'];
  const params: Array<string | number> = [userId];
  
  if (filters.search) { 
    clauses.push('(description LIKE ? OR category LIKE ?)'); 
    params.push(`%${filters.search}%`, `%${filters.search}%`); 
  }

  if (filters.category) { 
    clauses.push('category = ?'); 
    params.push(filters.category); 
  }

  if (filters.from) { 
    clauses.push('spent_at >= ?'); 
    params.push(filters.from); 
  }

  if (filters.to) { 
    clauses.push('spent_at <= ?'); 
    params.push(filters.to); 
  }

  return { 
    sql: clauses.join(' AND '), 
    params 
 };
};

const mapExpense = (row: ExpenseRow): Expense => ({ 
    id: row.id, 
    userId: row.user_id, 
    amount: Number(row.amount), 
    category: row.category, 
    description: row.description, 
    spentAt: String(row.spent_at).slice(0, 10), 
    createdAt: String(row.created_at) 
});

export const listExpenses = async (userId: number, filters: ExpenseFilters): Promise<{ rows: Expense[]; total: number }> => {
  const where = conditions(userId, filters);
  const [countRows] = await db.execute<RowDataPacket[]>(`SELECT COUNT(*) AS total FROM expenses WHERE ${where.sql}`, where.params);
  const [rows] = await db.execute<ExpenseRow[]>(`SELECT id, user_id, amount, category, description, spent_at, created_at FROM expenses WHERE ${where.sql} ORDER BY spent_at DESC, id DESC LIMIT ? OFFSET ?`, [...where.params, filters.limit, offsetFor(filters.page, filters.limit)]);
  
  return { 
    rows: rows.map(mapExpense), 
    total: Number(countRows[0].total) 
  };
};

export const findExpense = async (userId: number, id: number): Promise<Expense | undefined> => {
  const [rows] = await db.execute<ExpenseRow[]>('SELECT id, user_id, amount, category, description, spent_at, created_at FROM expenses WHERE user_id = ? AND id = ?', [userId, id]);
  return rows[0] ? mapExpense(rows[0]) : undefined;
};

export const insertExpense = async (userId: number, data: Omit<Expense, 'id' | 'userId' | 'createdAt'>): Promise<number> => {
  const [result] = await db.execute<ResultSetHeader>('INSERT INTO expenses (user_id, amount, category, description, spent_at) VALUES (?, ?, ?, ?, ?)', [userId, data.amount, data.category, data.description, data.spentAt]);
  return result.insertId;
};

export const updateExpense = async (userId: number, id: number, data: Omit<Expense, 'id' | 'userId' | 'createdAt'>): Promise<void> => {
  await db.execute('UPDATE expenses SET amount = ?, category = ?, description = ?, spent_at = ? WHERE user_id = ? AND id = ?', [data.amount, data.category, data.description, data.spentAt, userId, id]);
};

export const deleteExpense = async (userId: number, id: number): Promise<void> => { 
    await db.execute('DELETE FROM expenses WHERE user_id = ? AND id = ?', [userId, id]); 
};

export const monthlyTotals = async (userId: number, year: number): Promise<Array<{ month: number; total: number }>> => {
  const [rows] = await db.execute<RowDataPacket[]>('SELECT MONTH(spent_at) AS month, SUM(amount) AS total FROM expenses WHERE user_id = ? AND YEAR(spent_at) = ? GROUP BY MONTH(spent_at) ORDER BY month', [userId, year]);
  return rows.map((row) => ({ 
    month: Number(row.month), 
    total: Number(row.total) 
  }));
  
};
