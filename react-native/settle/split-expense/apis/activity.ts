/**
 * Activity Feed API
 * Real backend implementations
 */

import apiClient from '../utils/api-client';

export interface ActivityItem {
  id: string;
  type: 'group_created' | 'expense_added' | 'expense_edited' | 'payment' | 'comment';
  title: string;
  subtitle?: string;
  timestamp: string;
  groupId?: string;
  expenseId?: string;
  userId: string;
}

/**
 * Get activity feed
 */
export const getActivity = async (): Promise<ActivityItem[]> => {
  try {
    const response = await apiClient.get('/activity');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching activity:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch activity'
    } as any;
  }
};

/**
 * Get activity by group
 */
export const getActivityByGroup = async (groupId: string): Promise<ActivityItem[]> => {
  try {
    const response = await apiClient.get(`/activity?groupId=${groupId}`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching activity by group:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch activity by group'
    } as any;
  }
};

