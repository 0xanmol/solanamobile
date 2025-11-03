/**
 * Expenses API
 * Real backend implementations
 */

import apiClient from '../utils/api-client';

export interface Participant {
  id: string;
  expense_id: string;
  user_id: string;
  share: number;
  paid_share: number;
  name: string;
  pubkey: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  currency: string;
  date: string;
  paid_by: string;
  paid_by_name: string;
  paid_by_pubkey: string;
  group_id?: string;
  participants: Participant[];
  split_type: 'equally' | 'unequally' | 'percentage' | 'shares' | 'adjustment';
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
  participants?: { userId: string, share: number }[];
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
  try {
    const response = await apiClient.post('/expenses', data);
    return response.data;
  } catch (error: any) {
    console.error('Error creating expense:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to create expense'
    };
  }
};

/**
 * Get expenses
 */
export const getExpenses = async (groupId?: string): Promise<{ success: true, data: Expense[] } | { success: false, message: string }> => {
  try {
    const endpoint = groupId ? `/expenses?groupId=${groupId}` : '/expenses';
    const response = await apiClient.get(endpoint);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching expenses:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch expenses'
    } as any;
  }
};

/**
 * Get single expense
 */
export const getExpense = async (id: string): Promise<Expense> => {
  try {
    const response = await apiClient.get(`/expenses/${id}`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching expense:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch expense'
    } as any;
  }
};

/**
 * Update expense
 */
export const updateExpense = async (
  id: string,
  data: Partial<CreateExpenseData>
): Promise<{ success: boolean; expense: Expense }> => {
  try {
    const response = await apiClient.put(`/expenses/${id}`, data);
    return response.data;
  } catch (error: any) {
    console.error('Error updating expense:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update expense'
    };
  }
};

/**
 * Delete expense
 */
export const deleteExpense = async (id: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await apiClient.delete(`/expenses/${id}`);
    return response.data;
  } catch (error: any) {
    console.error('Error deleting expense:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to delete expense'
    };
  }
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
  try {
    const response = await apiClient.put(`/expenses/${expenseId}/split`, data);
    return response.data;
  } catch (error: any) {
    console.error('Error adjusting split:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to adjust split'
    };
  }
};

