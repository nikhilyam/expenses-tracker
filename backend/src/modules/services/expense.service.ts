import { ERROR_MESSAGES } from '../../constants/errorMessages.js';
import { SUCCESS_MESSAGES } from '../../constants/successMessages.js';
import { NotFoundError } from '../../errors/index.js';
import type { ExpenseFilters } from '../../common/types.js';
import { deleteExpense, findExpense, insertExpense, listExpenses, updateExpense } from '../repositories/expense.repository.js';
import { totalPagesFor } from '../../utils/pagination.utils.js';

export const getExpenses = async (userId: number, filters: ExpenseFilters) => {
  const result = await listExpenses(userId, filters);
  return { 
    ...result, 
    items: result.rows, 
    rows: undefined, 
    totalPages: totalPagesFor(result.total, filters.limit) 
  };
};

export const addExpense = async (
    userId: number, 
    data: { 
        amount: number; 
        category: string; 
        description: string; 
        spentAt: string 
    }) => ({ 
        message: SUCCESS_MESSAGES.EXPENSE_CREATED, 
        expense: await insertAndFetch(userId, data) 
    });

export const editExpense = async (
    userId: number, 
    id: number, 
    data: { 
        amount: number; 
        category: string; 
        description: string; 
        spentAt: string 
    }) => {
  if (!(await findExpense(userId, id))) throw new NotFoundError(ERROR_MESSAGES.EXPENSE_NOT_FOUND);
  await updateExpense(userId, id, data);
  return { 
    message: SUCCESS_MESSAGES.EXPENSE_UPDATED, 
    expense: await findExpense(userId, id) 
  };
};

export const removeExpense = async (userId: number, id: number) => {
  if (!(await findExpense(userId, id))) throw new NotFoundError(ERROR_MESSAGES.EXPENSE_NOT_FOUND);
  await deleteExpense(userId, id);
  return { message: SUCCESS_MESSAGES.EXPENSE_DELETED };
};

const insertAndFetch = async (
    userId: number, 
    data: { 
        amount: number; 
        category: string; 
        description: string; 
        spentAt: string 
    }) => { 
        const id = await insertExpense(userId, data); 
        return findExpense(userId, id); 
    };
