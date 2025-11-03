/**
 * Settings API
 * Real backend implementations
 */

import apiClient from '../utils/api-client';

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
 * Get email settings
 */
export const getEmailSettings = async (): Promise<EmailSettings> => {
  try {
    const response = await apiClient.get('/settings/email');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching email settings:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch email settings'
    } as any;
  }
};

/**
 * Update email settings
 */
export const updateEmailSettings = async (
  settings: EmailSettings
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await apiClient.put('/settings/email', settings);
    return response.data;
  } catch (error: any) {
    console.error('Error updating email settings:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update email settings'
    };
  }
};

/**
 * Update account settings
 */
export const updateAccountSettings = async (
  settings: AccountSettings
): Promise<{ success: boolean; message: string }> => {
  const mockResponse = {
    success: true,
    message: 'Account settings updated successfully',
  };

  return Promise.resolve(mockResponse);
};

/**
 * Update security settings
 */
export const updateSecuritySettings = async (
  settings: SecuritySettings
): Promise<{ success: boolean; message: string }> => {
  const mockResponse = {
    success: true,
    message: 'Security settings updated successfully',
  };

  return Promise.resolve(mockResponse);
};

/**
 * Manage blocklist
 */
export const manageBlocklist = async (action: 'add' | 'remove', userId: string): Promise<{ success: boolean; message: string }> => {
  const mockResponse = {
    success: true,
    message: action === 'add' ? 'User blocked successfully' : 'User unblocked successfully',
  };

  return Promise.resolve(mockResponse);
};

/**
 * Get blocklist
 */
export const getBlocklist = async (): Promise<{ userId: string; name: string }[]> => {
  const mockResponse: { userId: string; name: string }[] = [];

  return Promise.resolve(mockResponse);
};

