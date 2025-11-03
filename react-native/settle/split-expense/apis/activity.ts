/**
 * Activity Feed API
 * Mock implementations that log request/response data
 */

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
  const request = {
    endpoint: 'GET /api/activity',
  };
  console.log('[API] Request:', request);

  const response: ActivityItem[] = [
    {
      id: 'activity_1',
      type: 'group_created',
      title: 'You created the group "Uu3uu".',
      timestamp: 'Today, 2:54 am',
      groupId: 'group_2',
      userId: 'user_123',
    },
    {
      id: 'activity_2',
      type: 'expense_added',
      title: 'You added "Bought coffee" in "Jje".',
      subtitle: 'You do not owe anything',
      timestamp: '6 days ago, 9:10 pm',
      groupId: 'group_1',
      userId: 'user_123',
    },
  ];
  console.log('[API] Response:', response);

  return Promise.resolve(response);
};

/**
 * Get activity by group
 */
export const getActivityByGroup = async (groupId: string): Promise<ActivityItem[]> => {
  const request = {
    endpoint: `GET /api/activity?groupId=${groupId}`,
  };
  console.log('[API] Request:', request);

  const response: ActivityItem[] = [
    {
      id: 'activity_1',
      type: 'expense_added',
      title: 'You added "Bought coffee" in "Jje".',
      subtitle: 'You do not owe anything',
      timestamp: '6 days ago, 9:10 pm',
      groupId,
      userId: 'user_123',
    },
  ];
  console.log('[API] Response:', response);

  return Promise.resolve(response);
};

