import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.config.js';
import type { AuthenticatedRequestUser } from '../common/types.js';

export const hashPassword = (password: string): Promise<string> => bcrypt.hash(password, 12);
export const comparePassword = (password: string, hash: string): Promise<boolean> => bcrypt.compare(password, hash);
const jwtSecret = env.JWT_SECRET as string;
export const createToken = (user: AuthenticatedRequestUser): string => jwt.sign(user, jwtSecret, { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] });
export const verifyToken = (token: string): AuthenticatedRequestUser => jwt.verify(token, jwtSecret) as unknown as AuthenticatedRequestUser;
