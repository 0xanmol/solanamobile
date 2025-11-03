/**
 * Friends API
 * Real backend implementations
 */

import apiClient from '../utils/api-client';

export interface Friend {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  avatar?: string;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  avatarUri?: string;
  alreadyFriend?: boolean;
}

/**
 * Get all friends
 */
export const getFriends = async (): Promise<Friend[]> => {
  try {
    const response = await apiClient.get('/friends');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching friends:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch friends'
    } as any;
  }
};

/**
 * Add friend by email/name
 */
export const addFriend = async (data: { name: string; email: string }): Promise<{ success: boolean; friend: Friend }> => {
  try {
    const response = await apiClient.post('/friends', data);
    return response.data;
  } catch (error: any) {
    console.error('Error adding friend:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to add friend'
    };
  }
};

/**
 * Invite friend (send invitation)
 */
export const inviteFriend = async (data: {
  name?: string;
  email?: string;
  phone?: string;
}): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await apiClient.post('/friends/invite', data);
    return response.data;
  } catch (error: any) {
    console.error('Error inviting friend:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to send invitation'
    };
  }
};

/**
 * Get phone contacts
 */
export const getContacts = async (): Promise<Contact[]> => {
  const mockContacts: Contact[] = [
    { id: 'c1', name: '1', phone: '+919606933222', alreadyFriend: true },
    { id: 'c2', name: '2', phone: '+919606933222' },
    { id: 'c3', name: 'AJAY Fmcg VERMA', phone: '+918619282800' },
    { id: 'c7', name: 'Aarav', phone: '', alreadyFriend: true },
  ];

  return Promise.resolve(mockContacts);
};

/**
 * Remove friend
 */
export const removeFriend = async (friendId: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await apiClient.delete(`/friends/${friendId}`);
    return response.data;
  } catch (error: any) {
    console.error('Error removing friend:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to remove friend'
    };
  }
};

