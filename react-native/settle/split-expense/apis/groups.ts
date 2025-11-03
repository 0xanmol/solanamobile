/**
 * Groups API
 * Mock implementations that log request/response data
 */

export interface Group {
  id: string;
  name: string;
  type: 'trip' | 'home' | 'couple' | 'other';
  icon?: string;
  color?: string;
  startDate?: string;
  endDate?: string;
  simplifyDebts?: boolean;
  members?: GroupMember[];
}

export interface GroupMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface CreateGroupData {
  name: string;
  type: 'trip' | 'home' | 'couple' | 'other';
  startDate?: string;
  endDate?: string;
}

/**
 * Get all groups
 */
export const getGroups = async (): Promise<Group[]> => {
  const request = {
    endpoint: 'GET /api/groups',
  };
  console.log('[API] Request:', request);

  const response: Group[] = [
    {
      id: 'group_1',
      name: 'Jje',
      type: 'home',
      color: '#781D27',
      simplifyDebts: false,
    },
    {
      id: 'group_2',
      name: 'Uu3uu',
      type: 'other',
      color: '#781D27',
    },
  ];
  console.log('[API] Response:', response);

  return Promise.resolve(response);
};

/**
 * Get single group details
 */
export const getGroup = async (id: string): Promise<Group> => {
  const request = {
    endpoint: `GET /api/groups/${id}`,
  };
  console.log('[API] Request:', request);

  const response: Group = {
    id,
    name: 'Jje',
    type: 'home',
    color: '#781D27',
    simplifyDebts: false,
    members: [
      {
        id: 'user_1',
        name: 'Saurav Verma (you)',
        email: 'skbmasale941@gmail.com',
      },
    ],
  };
  console.log('[API] Response:', response);

  return Promise.resolve(response);
};

/**
 * Create new group
 */
export const createGroup = async (data: CreateGroupData): Promise<{ success: boolean; group: Group }> => {
  const request = {
    endpoint: 'POST /api/groups',
    body: data,
  };
  console.log('[API] Request:', request);

  const response = {
    success: true,
    group: {
      id: 'group_' + Date.now(),
      ...data,
      color: '#781D27',
    },
  };
  console.log('[API] Response:', response);

  return Promise.resolve(response);
};

/**
 * Update group info
 */
export const updateGroup = async (
  id: string,
  data: Partial<CreateGroupData>
): Promise<{ success: boolean; group: Group }> => {
  const request = {
    endpoint: `PUT /api/groups/${id}`,
    body: data,
  };
  console.log('[API] Request:', request);

  const response = {
    success: true,
    group: {
      id,
      name: data.name || 'Jje',
      type: data.type || 'home',
      color: '#781D27',
    },
  };
  console.log('[API] Response:', response);

  return Promise.resolve(response);
};

/**
 * Delete group
 */
export const deleteGroup = async (id: string): Promise<{ success: boolean; message: string }> => {
  const request = {
    endpoint: `DELETE /api/groups/${id}`,
  };
  console.log('[API] Request:', request);

  const response = {
    success: true,
    message: 'Group deleted successfully',
  };
  console.log('[API] Response:', response);

  return Promise.resolve(response);
};

/**
 * Leave group
 */
export const leaveGroup = async (id: string): Promise<{ success: boolean; message: string }> => {
  const request = {
    endpoint: `POST /api/groups/${id}/leave`,
  };
  console.log('[API] Request:', request);

  const response = {
    success: true,
    message: 'Left group successfully',
  };
  console.log('[API] Response:', response);

  return Promise.resolve(response);
};

/**
 * Update group settings
 */
export const updateGroupSettings = async (
  id: string,
  settings: { simplifyDebts?: boolean; defaultSplit?: string }
): Promise<{ success: boolean; message: string }> => {
  const request = {
    endpoint: `PUT /api/groups/${id}/settings`,
    body: settings,
  };
  console.log('[API] Request:', request);

  const response = {
    success: true,
    message: 'Group settings updated',
  };
  console.log('[API] Response:', response);

  return Promise.resolve(response);
};

/**
 * Search groups
 */
export const searchGroups = async (query: string): Promise<Group[]> => {
  const request = {
    endpoint: `GET /api/groups/search?q=${query}`,
  };
  console.log('[API] Request:', request);

  const response: Group[] = [
    {
      id: 'group_1',
      name: 'Weekend Trip to Paris',
      type: 'trip',
      color: '#16A34A',
    },
  ];
  console.log('[API] Response:', response);

  return Promise.resolve(response);
};

/**
 * Get group members
 */
export const getGroupMembers = async (groupId: string): Promise<GroupMember[]> => {
  const request = {
    endpoint: `GET /api/groups/${groupId}/members`,
  };
  console.log('[API] Request:', request);

  const response: GroupMember[] = [
    {
      id: 'user_1',
      name: 'Saurav Verma (you)',
      email: 'skbmasale941@gmail.com',
    },
  ];
  console.log('[API] Response:', response);

  return Promise.resolve(response);
};

/**
 * Add member to group
 */
export const addGroupMember = async (
  groupId: string,
  data: { email?: string; userId?: string }
): Promise<{ success: boolean; message: string }> => {
  const request = {
    endpoint: `POST /api/groups/${groupId}/members`,
    body: data,
  };
  console.log('[API] Request:', request);

  const response = {
    success: true,
    message: 'Member added to group',
  };
  console.log('[API] Response:', response);

  return Promise.resolve(response);
};

