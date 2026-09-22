import { ERROR_MESSAGES } from '../../constants/errorMessages.js';
import { SUCCESS_MESSAGES } from '../../constants/successMessages.js';
import { ConflictError, UnauthorizedError } from '../../errors/index.js';
import { comparePassword, createToken, hashPassword } from '../../helpers/auth.helpers.js';
import { createUser, findUserByEmail } from '../repositories/user.repository.js';

export const register = async (name: string, email: string, password: string) => {
  if (await findUserByEmail(email)) throw new ConflictError(ERROR_MESSAGES.USER_EXISTS);
  const id = await createUser(name, email, await hashPassword(password));
  return { message: SUCCESS_MESSAGES.REGISTERED, token: createToken({ id, email, name }), user: { id, email, name } };
};
export const login = async (email: string, password: string) => {
  const user = await findUserByEmail(email);
  if (!user || !(await comparePassword(password, user.password_hash))) throw new UnauthorizedError(ERROR_MESSAGES.INVALID_CREDENTIALS);
  return { message: SUCCESS_MESSAGES.LOGGED_IN, token: createToken({ id: user.id, email: user.email, name: user.name }), user: { id: user.id, email: user.email, name: user.name } };
};
