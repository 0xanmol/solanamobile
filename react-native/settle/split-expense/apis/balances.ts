/**
 * Balances/Settlement API
 * Real backend implementations
 */

import apiClient from '../utils/api-client';

export interface Balance {
  id: string;
  userId: string;
  userName: string;
  userPubkey: string;
  userAvatar?: string;
  amount: number;
  type: 'gets_back' | 'owes';
}

export interface Settlement {
  id: string;
  from: string;
  to: string;
  amount: number;
  date?: string;
  notes?: string;
}

/**
 * Get balances
 */
export const getBalances = async (groupId?: string): Promise<Balance[]> => {
  try {
    // Add timestamp to prevent caching issues
    const timestamp = Date.now();
    const endpoint = groupId
      ? `/balances?groupId=${groupId}&t=${timestamp}`
      : `/balances?t=${timestamp}`;
    const response = await apiClient.get(endpoint);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching balances:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch balances'
    } as any;
  }
};

/**
 * Send debt reminder
 */
export const remindDebt = async (data: {
  debtor: string;
  creditor: string;
  amount: string;
}): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await apiClient.post('/balances/remind', data);
    return response.data;
  } catch (error: any) {
    console.error('Error sending reminder:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to send reminder'
    };
  }
};

/**
 * Process settlement
 */
export const settleUp = async (data: {
  from: string;
  to: string;
  amount: number;
  groupId?: string;
  date?: string;
  notes?: string;
  transactionSignature?: string;
}): Promise<{ success: boolean; settlement: Settlement }> => {
  try {
    // Backend expects fromUserId and toUserId, not from and to
    const requestData = {
      fromUserId: data.from,
      toUserId: data.to,
      amount: data.amount,
      groupId: data.groupId,
      date: data.date,
      notes: data.notes,
      transactionSignature: data.transactionSignature,
    };
    const response = await apiClient.post('/balances/settle', requestData);
    return response.data;
  } catch (error: any) {
    console.error('Error settling up:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to process settlement'
    } as any;
  }
};

/**
 * Add settlement date
 */
export const addSettleUpDate = async (data: {
  settlementId: string;
  date: string;
}): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await apiClient.put('/balances/settle/date', data);
    return response.data;
  } catch (error: any) {
    console.error('Error adding settlement date:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to add settlement date'
    };
  }
};

/**
 * Add people to settlement
 */
export const addPeopleToSettleUp = async (data: {
  settlementId: string;
  userIds: string[];
}): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await apiClient.put('/balances/settle/people', data);
    return response.data;
  } catch (error: any) {
    console.error('Error adding people to settlement:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to add people to settlement'
    };
  }
};

