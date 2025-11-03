/**
 * Search API
 * Mock implementations that log request/response data
 */

export interface UserSearchResult {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface GroupSearchResult {
  id: string;
  name: string;
  type: string;
  memberCount: number;
}

export interface SearchResults {
  users: UserSearchResult[];
  groups: GroupSearchResult[];
}

/**
 * Search users
 */
export const searchUsers = async (query: string): Promise<UserSearchResult[]> => {
  const request = {
    endpoint: `GET /api/search/users?q=${query}`,
  };
  console.log('[API] Request:', request);

  const response: UserSearchResult[] = [
    {
      id: 'user_1',
      name: 'John Doe',
      email: 'john@example.com',
    },
    {
      id: 'user_2',
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
    },
  ];
  console.log('[API] Response:', response);

  return Promise.resolve(response);
};

/**
 * Unified search (groups and users)
 */
export const searchAll = async (query: string): Promise<SearchResults> => {
  const request = {
    endpoint: `GET /api/search?q=${query}`,
  };
  console.log('[API] Request:', request);

  const response: SearchResults = {
    users: [
      {
        id: 'user_1',
        name: 'John Doe',
        email: 'john@example.com',
      },
    ],
    groups: [
      {
        id: 'group_1',
        name: 'Weekend Trip to Paris',
        type: 'trip',
        memberCount: 5,
      },
    ],
  };
  console.log('[API] Response:', response);

  return Promise.resolve(response);
};

