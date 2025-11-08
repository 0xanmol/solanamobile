/**
 * Groups API
 * Real backend implementations
 */

import apiClient from '../utils/api-client';

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
export const getGroups = async (): Promise<{ success: boolean, data?: Group[] } | { success: false, message: string }> => {
  try {
    // Add timestamp to prevent caching issues
    const timestamp = Date.now();
    const response = await apiClient.get(`/groups?t=${timestamp}`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching groups:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch groups'
    } as any;
  }
};

/**
 * Get single group details
 */
export const getGroup = async (id: string): Promise<{ success: true, data: Group } | { success: false, message: string }> => {
  try {
    const response = await apiClient.get(`/groups/${id}`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching group:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch group'
    } as any;
  }
};

/**
 * Create new group
 */
export const createGroup = async (data: CreateGroupData): Promise<{ success: boolean; group: Group }> => {
  try {
    const response = await apiClient.post('/groups', data);
    return response.data;
  } catch (error: any) {
    console.error('Error creating group:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to create group'
    };
  }
};

/**
 * Update group info
 */
export const updateGroup = async (
  id: string,
  data: Partial<CreateGroupData>
): Promise<{ success: boolean; group: Group }> => {
  try {
    const response = await apiClient.put(`/groups/${id}`, data);
    return response.data;
  } catch (error: any) {
    console.error('Error updating group:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update group'
    };
  }
};

/**
 * Delete group
 */
export const deleteGroup = async (id: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await apiClient.delete(`/groups/${id}`);
    return response.data;
  } catch (error: any) {
    console.error('Error deleting group:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to delete group'
    };
  }
};

/**
 * Leave group
 */
export const leaveGroup = async (id: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await apiClient.post(`/groups/${id}/leave`);
    return response.data;
  } catch (error: any) {
    console.error('Error leaving group:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to leave group'
    };
  }
};

/**
 * Update group settings
 */
export const updateGroupSettings = async (
  id: string,
  settings: { simplifyDebts?: boolean; defaultSplit?: string }
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await apiClient.put(`/groups/${id}/settings`, settings);
    return response.data;
  } catch (error: any) {
    console.error('Error updating group settings:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update group settings'
    };
  }
};

/**
 * Search groups
 */
export const searchGroups = async (query: string): Promise<Group[]> => {
  try {
    const response = await apiClient.get(`/groups/search?q=${query}`);
    return response.data;
  } catch (error: any) {
    console.error('Error searching groups:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to search groups'
    } as any;
  }
};

/**
 * Get group members
 */
export const getGroupMembers = async (groupId: string): Promise<GroupMember[]> => {
  try {
    const response = await apiClient.get(`/groups/${groupId}/members`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching group members:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch group members'
    } as any;
  }
};

/**
 * Add member to group
 */
export const addGroupMember = async (
  groupId: string,
  data: { email?: string; userId?: string }
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await apiClient.post(`/groups/${groupId}/members`, data);
    return response.data;
  } catch (error: any) {
    console.error('Error adding group member:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to add group member'
    };
  }
};

