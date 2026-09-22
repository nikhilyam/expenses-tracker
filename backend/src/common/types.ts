export interface AuthenticatedRequestUser {
  id: number;
  email: string;
  name: string;
}

export interface Expense {
  id: number;
  userId: number;
  amount: number;
  category: string;
  description: string;
  spentAt: string;
  createdAt: string;
}

export interface ExpenseFilters {
  page: number;
  limit: number;
  search?: string;
  category?: string;
  from?: string;
  to?: string;
}

export interface PaginatedResult<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
