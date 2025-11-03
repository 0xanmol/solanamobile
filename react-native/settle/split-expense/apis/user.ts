/**
 * User Profile API
 * Mock implementations that log request/response data
 */

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
  const request = {
    endpoint: 'GET /api/user/profile',
  };
  console.log('[API] Request:', request);

  const response: User = {
    id: 'user_123',
    name: 'Sai Kumar',
    email: 'Hellosir999@gmail.com',
    phoneNumber: '+919606933222',
    currency: 'USD',
    timezone: '(GMT+05:30) Chennai',
    language: 'English',
  };
  console.log('[API] Response:', response);

  return Promise.resolve(response);
};

/**
 * Update user profile
 */
export const updateProfile = async (data: UpdateProfileData): Promise<{ success: boolean; user: User }> => {
  const request = {
    endpoint: 'PUT /api/user/profile',
    body: data,
  };
  console.log('[API] Request:', request);

  const response = {
    success: true,
    user: {
      id: 'user_123',
      name: data.name || 'Sai Kumar',
      email: data.email || 'Hellosir999@gmail.com',
      phoneNumber: data.phoneNumber,
    },
  };
  console.log('[API] Response:', response);

  return Promise.resolve(response);
};

/**
 * Update user password
 */
export const updatePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> => {
  const request = {
    endpoint: 'PUT /api/user/password',
    body: { currentPassword, newPassword },
  };
  console.log('[API] Request:', request);

  const response = {
    success: true,
    message: 'Password updated successfully',
  };
  console.log('[API] Response:', response);

  return Promise.resolve(response);
};

/**
 * Upload profile image
 */
export const uploadProfileImage = async (imageUri: string): Promise<{ success: boolean; imageUrl: string }> => {
  const request = {
    endpoint: 'POST /api/user/profile-image',
    body: { imageUri },
  };
  console.log('[API] Request:', request);

  const response = {
    success: true,
    imageUrl: imageUri,
  };
  console.log('[API] Response:', response);

  return Promise.resolve(response);
};

/**
 * Delete user account
 */
export const deleteAccount = async (): Promise<{ success: boolean; message: string }> => {
  const request = {
    endpoint: 'DELETE /api/user/account',
  };
  console.log('[API] Request:', request);

  const response = {
    success: true,
    message: 'Account deleted successfully',
  };
  console.log('[API] Response:', response);

  return Promise.resolve(response);
};

