/**
 * Search API
 * Real backend implementations
 */

import apiClient from '../utils/api-client';

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
  try {
    const response = await apiClient.get(`/search/users?q=${query}`);
    return response.data;
  } catch (error: any) {
    console.error('Error searching users:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to search users'
    } as any;
  }
};

/**
 * Unified search (groups and users)
 */
export const searchAll = async (query: string): Promise<SearchResults> => {
  try {
    const response = await apiClient.get(`/search?q=${query}`);
    return response.data;
  } catch (error: any) {
    console.error('Error performing search:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to perform search'
    } as any;
  }
};

