/**
 * Expenses API
 * Mock implementations that log request/response data
 */

export interface Expense {
  id: string;
  description: string;
  amount: number;
  currency: string;
  date: string;
  paidBy: string;
  groupId?: string;
  participants: string[];
  splitMethod: 'equally' | 'unequally' | 'percentages' | 'shares' | 'adjustment';
  notes?: string;
  category?: string;
}

export interface CreateExpenseData {
  description: string;
  amount: number;
  currency?: string;
  date?: string;
  paidBy: string;
  groupId?: string;
  friendIds?: string[];
  splitMethod?: 'equally' | 'unequally' | 'percentages' | 'shares' | 'adjustment';
  notes?: string;
}

export interface SplitAdjustment {
  userId: string;
  amount?: number;
  percentage?: number;
  shares?: number;
  adjustment?: number;
}

/**
 * Create expense
 */
export const createExpense = async (data: CreateExpenseData): Promise<{ success: boolean; expense: Expense }> => {
  const request = {
    endpoint: 'POST /api/expenses',
    body: data,
  };
  console.log('[API] Request:', request);

  const response = {
    success: true,
    expense: {
      id: 'expense_' + Date.now(),
      description: data.description,
      amount: data.amount,
      currency: data.currency || 'USD',
      date: data.date || new Date().toISOString(),
      paidBy: data.paidBy,
      groupId: data.groupId,
      participants: data.friendIds || [],
      splitMethod: data.splitMethod || 'equally',
      notes: data.notes,
    },
  };
  console.log('[API] Response:', response);

  return Promise.resolve(response);
};

/**
 * Get expenses
 */
export const getExpenses = async (groupId?: string): Promise<Expense[]> => {
  const request = {
    endpoint: groupId ? `GET /api/expenses?groupId=${groupId}` : 'GET /api/expenses',
  };
  console.log('[API] Request:', request);

  const response: Expense[] = [
    {
      id: 'exp_1',
      description: 'Cock sugar',
      amount: 1965199.0,
      currency: 'USD',
      date: 'Oct. 23',
      paidBy: 'You',
      participants: ['user_1', 'user_2'],
      splitMethod: 'equally',
    },
  ];
  console.log('[API] Response:', response);

  return Promise.resolve(response);
};

/**
 * Get single expense
 */
export const getExpense = async (id: string): Promise<Expense> => {
  const request = {
    endpoint: `GET /api/expenses/${id}`,
  };
  console.log('[API] Request:', request);

  const response: Expense = {
    id,
    description: 'Cock sugar',
    amount: 1965199.0,
    currency: 'USD',
    date: 'Oct. 23',
    paidBy: 'You',
    participants: ['user_1', 'user_2'],
    splitMethod: 'equally',
  };
  console.log('[API] Response:', response);

  return Promise.resolve(response);
};

/**
 * Update expense
 */
export const updateExpense = async (
  id: string,
  data: Partial<CreateExpenseData>
): Promise<{ success: boolean; expense: Expense }> => {
  const request = {
    endpoint: `PUT /api/expenses/${id}`,
    body: data,
  };
  console.log('[API] Request:', request);

  const response = {
    success: true,
    expense: {
      id,
      description: data.description || 'Cock sugar',
      amount: data.amount || 1965199.0,
      currency: data.currency || 'USD',
      date: data.date || 'Oct. 23',
      paidBy: data.paidBy || 'You',
      participants: data.friendIds || ['user_1', 'user_2'],
      splitMethod: data.splitMethod || 'equally',
    },
  };
  console.log('[API] Response:', response);

  return Promise.resolve(response);
};

/**
 * Delete expense
 */
export const deleteExpense = async (id: string): Promise<{ success: boolean; message: string }> => {
  const request = {
    endpoint: `DELETE /api/expenses/${id}`,
  };
  console.log('[API] Request:', request);

  const response = {
    success: true,
    message: 'Expense deleted successfully',
  };
  console.log('[API] Response:', response);

  return Promise.resolve(response);
};

/**
 * Adjust expense split
 */
export const adjustSplit = async (
  expenseId: string,
  data: {
    method: 'equally' | 'unequally' | 'percentages' | 'shares' | 'adjustment';
    adjustments: SplitAdjustment[];
  }
): Promise<{ success: boolean; message: string }> => {
  const request = {
    endpoint: `PUT /api/expenses/${expenseId}/split`,
    body: data,
  };
  console.log('[API] Request:', request);

  const response = {
    success: true,
    message: 'Split adjusted successfully',
  };
  console.log('[API] Response:', response);

  return Promise.resolve(response);
};

