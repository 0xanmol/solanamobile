/**
 * User Profile API
 * Real backend implementations
 */

import apiClient from '../utils/api-client';

export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  profileImage?: string;
  currency?: string;
  timezone?: string;
  language?: string;
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
  phoneNumber?: string;
}

/**
 * Get current user profile
 */
export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await apiClient.get('/user/profile');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching user profile:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch user profile'
    } as any;
  }
};

/**
 * Update user profile
 */
export const updateProfile = async (data: UpdateProfileData): Promise<{ success: boolean; user: User }> => {
  try {
    const response = await apiClient.put('/user/profile', data);
    return response.data;
  } catch (error: any) {
    console.error('Error updating profile:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update profile'
    };
  }
};

/**
 * Update user password
 */
export const updatePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await apiClient.put('/user/password', { currentPassword, newPassword });
    return response.data;
  } catch (error: any) {
    console.error('Error updating password:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update password'
    };
  }
};

/**
 * Upload profile image
 */
export const uploadProfileImage = async (imageUri: string): Promise<{ success: boolean; imageUrl: string }> => {
  try {
    const response = await apiClient.post('/user/profile-image', { imageUri });
    return response.data;
  } catch (error: any) {
    console.error('Error uploading profile image:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to upload profile image'
    } as any;
  }
};

/**
 * Delete user account
 */
export const deleteAccount = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await apiClient.delete('/user/account');
    return response.data;
  } catch (error: any) {
    console.error('Error deleting account:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to delete account'
    };
  }
};

