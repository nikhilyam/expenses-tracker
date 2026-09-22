import type { RowDataPacket, ResultSetHeader } from 'mysql2';
import { db } from '../../config/db.config.js';

interface UserRow extends RowDataPacket { 
    id: number; 
    name: string; 
    email: string; 
    password_hash: string; 
}

export const findUserByEmail = async (email: string): Promise<UserRow | undefined> => {
  const [rows] = await db.execute<UserRow[]>('SELECT id, name, email, password_hash FROM users WHERE email = ?', [email]);
  return rows[0];
};

export const createUser = async (
    name: string, 
    email: string, 
    passwordHash: string
): Promise<number> => {
  const [result] = await db.execute<ResultSetHeader>('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)', [name, email, passwordHash]);
  return result.insertId;
};
