/**
 * Authentication API
 * Wallet-based authentication with Solana public keys
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient, { saveAuthToken, clearAuthData } from '../utils/api-client';

export interface ConnectWalletData {
  pubkey: string;
}

export interface CompleteProfileData {
  name: string;
  phone?: string;
}

export interface AuthResponse {
  success: boolean;
  data?: {
    token: string;
    user: {
      id: string;
      pubkey: string;
      name: string | null;
      phone?: string | null;
      avatar_uri?: string | null;
      is_profile_complete: number;
    };
    isNewUser: boolean;
    requiresProfileCompletion?: boolean;
  };
  message?: string;
}

/**
 * Connect wallet - Check if user exists or create new account
 */
export const connectWallet = async (pubkey: string): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post('/auth/connect', { pubkey });

    // Save token and user data if provided
    if (response.data.success && response.data.data) {
      if (response.data.data.token) {
        await saveAuthToken(response.data.data.token);
      }
      if (response.data.data.user) {
        await AsyncStorage.setItem('user_data', JSON.stringify(response.data.data.user));
      }
    }

    return response.data;
  } catch (error: any) {
    console.error('[API] Connect wallet error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to connect wallet',
    };
  }
};

/**
 * Complete profile for new users
 */
export const completeProfile = async (data: CompleteProfileData): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post('/auth/complete-profile', data);
    return response.data;
  } catch (error: any) {
    console.error('[API] Complete profile error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to complete profile',
    };
  }
};

/**
 * User logout
 */
export const logout = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await apiClient.post('/auth/logout');

    // Clear local auth data
    await clearAuthData();

    return response.data;
  } catch (error: any) {
    console.error('[API] Logout error:', error.response?.data || error.message);

    // Clear local data anyway
    await clearAuthData();

    return {
      success: true,
      message: 'Logged out successfully',
    };
  }
};

// Legacy functions kept for backward compatibility (not used with wallet auth)
export const signup = async () => {
  throw new Error('Email/password signup not supported. Use connectWallet instead.');
};

export const login = async () => {
  throw new Error('Email/password login not supported. Use connectWallet instead.');
};

export const googleSignIn = async () => {
  throw new Error('Google sign-in not implemented. Use connectWallet instead.');
};

export const forgotPassword = async () => {
  throw new Error('Password reset not supported with wallet authentication.');
};
