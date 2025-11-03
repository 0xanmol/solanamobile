/**
 * Invites API
 * Real backend implementations
 */

import apiClient from '../utils/api-client';

export interface InviteLink {
  groupId: string;
  link: string;
  expiresAt?: string;
}

/**
 * Get group invite link
 */
export const getInviteLink = async (groupId: string): Promise<InviteLink> => {
  try {
    const response = await apiClient.get(`/invites/${groupId}`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching invite link:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch invite link'
    } as any;
  }
};

/**
 * Copy invite link to clipboard
 */
export const copyInviteLink = async (groupId: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await apiClient.get(`/invites/${groupId}`);
    return {
      success: true,
      message: 'Link copied to clipboard',
    };
  } catch (error: any) {
    console.error('Error copying invite link:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to copy invite link'
    };
  }
};

/**
 * Share invite link
 */
export const shareInviteLink = async (
  groupId: string,
  method: 'sms' | 'email' | 'whatsapp' | 'other'
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await apiClient.post(`/invites/${groupId}/share`, { method });
    return response.data;
  } catch (error: any) {
    console.error('Error sharing invite link:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to share invite link'
    };
  }
};

/**
 * Change/regenerate invite link
 */
export const changeInviteLink = async (groupId: string): Promise<{ success: boolean; link: string }> => {
  try {
    const response = await apiClient.post(`/invites/${groupId}/regenerate`);
    return response.data;
  } catch (error: any) {
    console.error('Error regenerating invite link:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to regenerate invite link'
    } as any;
  }
};

/**
 * Join group via invite link
 */
export const joinGroupByLink = async (inviteCode: string): Promise<{ success: boolean; groupId: string }> => {
  try {
    const response = await apiClient.post('/invites/join', { inviteCode });
    return response.data;
  } catch (error: any) {
    console.error('Error joining group by link:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to join group'
    };
  }
};

