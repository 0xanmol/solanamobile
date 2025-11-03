/**
 * Settings API
 * Mock implementations that log request/response data
 */

export interface AccountSettings {
  name?: string;
  email?: string;
  phoneNumber?: string;
  timezone?: string;
  currency?: string;
  language?: string;
  friendSuggestions?: boolean;
}

export interface EmailSettings {
  addedToGroup?: boolean;
  addedAsFriend?: boolean;
  expenseAdded?: boolean;
  expenseEdited?: boolean;
  expenseCommented?: boolean;
  expenseDue?: boolean;
  someonePaysMe?: boolean;
  monthlySummary?: boolean;
  majorNews?: boolean;
}

export interface SecuritySettings {
  biometricsEnabled?: boolean;
  timeout?: string;
}

/**
 * Update account settings
 */
export const updateAccountSettings = async (
  settings: AccountSettings
): Promise<{ success: boolean; message: string }> => {
  const request = {
    endpoint: 'PUT /api/settings/account',
    body: settings,
  };
  console.log('[API] Request:', request);

  const response = {
    success: true,
    message: 'Account settings updated successfully',
  };
  console.log('[API] Response:', response);

  return Promise.resolve(response);
};

/**
 * Update email settings
 */
export const updateEmailSettings = async (
  settings: EmailSettings
): Promise<{ success: boolean; message: string }> => {
  const request = {
    endpoint: 'PUT /api/settings/email',
    body: settings,
  };
  console.log('[API] Request:', request);

  const response = {
    success: true,
    message: 'Email settings updated successfully',
  };
  console.log('[API] Response:', response);

  return Promise.resolve(response);
};

/**
 * Update security settings
 */
export const updateSecuritySettings = async (
  settings: SecuritySettings
): Promise<{ success: boolean; message: string }> => {
  const request = {
    endpoint: 'PUT /api/settings/security',
    body: settings,
  };
  console.log('[API] Request:', request);

  const response = {
    success: true,
    message: 'Security settings updated successfully',
  };
  console.log('[API] Response:', response);

  return Promise.resolve(response);
};

/**
 * Manage blocklist
 */
export const manageBlocklist = async (action: 'add' | 'remove', userId: string): Promise<{ success: boolean; message: string }> => {
  const request = {
    endpoint: 'POST /api/settings/blocklist',
    body: { action, userId },
  };
  console.log('[API] Request:', request);

  const response = {
    success: true,
    message: action === 'add' ? 'User blocked successfully' : 'User unblocked successfully',
  };
  console.log('[API] Response:', response);

  return Promise.resolve(response);
};

/**
 * Get blocklist
 */
export const getBlocklist = async (): Promise<{ userId: string; name: string }[]> => {
  const request = {
    endpoint: 'GET /api/settings/blocklist',
  };
  console.log('[API] Request:', request);

  const response: { userId: string; name: string }[] = [];
  console.log('[API] Response:', response);

  return Promise.resolve(response);
};

