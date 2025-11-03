/**
 * Reports & Export API
 * Mock implementations that log request/response data
 */

export interface ChartData {
  categorySpending: { category: string; amount: number; color: string }[];
  monthlyTrends: { month: string; spent: number; received: number }[];
}

export interface Totals {
  totalSpent: number;
  totalReceived: number;
  netBalance: number;
  period: string;
}

export interface ExportData {
  format: 'csv' | 'pdf' | 'excel';
  downloadUrl: string;
}

/**
 * Export expenses
 */
export const exportExpenses = async (
  groupId?: string,
  format: 'csv' | 'pdf' | 'excel' = 'csv'
): Promise<ExportData> => {
  const request = {
    endpoint: groupId ? `POST /api/reports/export?groupId=${groupId}` : 'POST /api/reports/export',
    body: { format },
  };
  console.log('[API] Request:', request);

  const response: ExportData = {
    format,
    downloadUrl: `https://api.splitwise.com/exports/expenses_${Date.now()}.${format}`,
  };
  console.log('[API] Response:', response);

  return Promise.resolve(response);
};

/**
 * Get expense charts data
 */
export const getCharts = async (groupId: string): Promise<ChartData> => {
  const request = {
    endpoint: `GET /api/reports/charts/${groupId}`,
  };
  console.log('[API] Request:', request);

  const response: ChartData = {
    categorySpending: [
      { category: 'Food', amount: 1500, color: '#FF6B35' },
      { category: 'Transport', amount: 800, color: '#004E89' },
      { category: 'Entertainment', amount: 600, color: '#8B5CF6' },
      { category: 'Utilities', amount: 400, color: '#10B981' },
    ],
    monthlyTrends: [
      { month: 'Oct', spent: 3000, received: 2500 },
      { month: 'Nov', spent: 3500, received: 3000 },
    ],
  };
  console.log('[API] Response:', response);

  return Promise.resolve(response);
};

/**
 * Get totals
 */
export const getTotals = async (
  groupId?: string,
  period: string = 'All time'
): Promise<Totals> => {
  const request = {
    endpoint: groupId 
      ? `GET /api/reports/totals?groupId=${groupId}&period=${period}` 
      : `GET /api/reports/totals?period=${period}`,
  };
  console.log('[API] Request:', request);

  const response: Totals = {
    totalSpent: 5000.0,
    totalReceived: 4500.0,
    netBalance: -500.0,
    period,
  };
  console.log('[API] Response:', response);

  return Promise.resolve(response);
};

/**
 * Convert currency
 */
export const convertCurrency = async (data: {
  amount: number;
  from: string;
  to: string;
}): Promise<{ amount: number; rate: number }> => {
  const request = {
    endpoint: 'POST /api/reports/convert',
    body: data,
  };
  console.log('[API] Request:', request);

  const mockRate = 1.2;
  const response = {
    amount: data.amount * mockRate,
    rate: mockRate,
  };
  console.log('[API] Response:', response);

  return Promise.resolve(response);
};

