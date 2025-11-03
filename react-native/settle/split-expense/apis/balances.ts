/**
 * Balances/Settlement API
 * Mock implementations that log request/response data
 */

export interface Balance {
  id: string;
  type: 'gets_back' | 'owes';
  person: string;
  amount: string;
  creditor?: string;
  color: string;
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
  const request = {
    endpoint: groupId ? `GET /api/balances?groupId=${groupId}` : 'GET /api/balances',
  };
  console.log('[API] Request:', request);

  const response: Balance[] = [
    {
      id: 'balance_1',
      type: 'gets_back',
      person: 'Saurav Verma',
      amount: '$3,231.00',
      color: '#10B981',
    },
    {
      id: 'balance_2',
      type: 'owes',
      person: 'Saurav Meghwal',
      amount: '$3,231.00',
      creditor: 'Saurav Verma',
      color: '#F59E0B',
    },
  ];
  console.log('[API] Response:', response);

  return Promise.resolve(response);
};

/**
 * Send debt reminder
 */
export const remindDebt = async (data: {
  debtor: string;
  creditor: string;
  amount: string;
}): Promise<{ success: boolean; message: string }> => {
  const request = {
    endpoint: 'POST /api/balances/remind',
    body: data,
  };
  console.log('[API] Request:', request);

  const response = {
    success: true,
    message: `Reminder sent to ${data.debtor}`,
  };
  console.log('[API] Response:', response);

  return Promise.resolve(response);
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
}): Promise<{ success: boolean; settlement: Settlement }> => {
  const request = {
    endpoint: 'POST /api/balances/settle',
    body: data,
  };
  console.log('[API] Request:', request);

  const response = {
    success: true,
    settlement: {
      id: 'settlement_' + Date.now(),
      from: data.from,
      to: data.to,
      amount: data.amount,
      date: data.date || new Date().toISOString(),
      notes: data.notes,
    },
  };
  console.log('[API] Response:', response);

  return Promise.resolve(response);
};

/**
 * Add settlement date
 */
export const addSettleUpDate = async (data: {
  settlementId: string;
  date: string;
}): Promise<{ success: boolean; message: string }> => {
  const request = {
    endpoint: 'PUT /api/balances/settle/date',
    body: data,
  };
  console.log('[API] Request:', request);

  const response = {
    success: true,
    message: 'Settlement date added',
  };
  console.log('[API] Response:', response);

  return Promise.resolve(response);
};

/**
 * Add people to settlement
 */
export const addPeopleToSettleUp = async (data: {
  settlementId: string;
  userIds: string[];
}): Promise<{ success: boolean; message: string }> => {
  const request = {
    endpoint: 'PUT /api/balances/settle/people',
    body: data,
  };
  console.log('[API] Request:', request);

  const response = {
    success: true,
    message: 'People added to settlement',
  };
  console.log('[API] Response:', response);

  return Promise.resolve(response);
};

