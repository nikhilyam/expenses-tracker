export interface User { 
    id: number; 
    name: string; 
    email: string; 
}

export interface Expense { 
    id: number; 
    amount: number; 
    category: string; 
    description: string; 
    spentAt: string; 
}

export interface ExpenseInput { 
    amount: number; 
    category: string; 
    description: string; 
    spentAt: string; 
}

export interface PageResult { 
    items: Expense[]; 
    page: number; 
    limit: number; 
    total: number; 
    totalPages: number; 
}

export interface MonthlyTotal { 
    month: string; 
    total: number; 
}
