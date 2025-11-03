import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Determine API URL based on platform
const getApiUrl = () => {
  // Check if .env has API_URL
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  if (envUrl) return envUrl;

  // Fallback based on platform
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000/api';
  } else {
    return 'http://localhost:3000/api';
  }
};

export const API_BASE_URL = getApiUrl();

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear storage
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('user_data');
      // Could navigate to login here if you have navigation ref
    }
    return Promise.reject(error);
  }
);

export default apiClient;

// Helper function to save auth token
export const saveAuthToken = async (token: string) => {
  await AsyncStorage.setItem('auth_token', token);
};

// Helper function to get auth token
export const getAuthToken = async () => {
  return await AsyncStorage.getItem('auth_token');
};

// Helper function to clear auth data
export const clearAuthData = async () => {
  await AsyncStorage.removeItem('auth_token');
  await AsyncStorage.removeItem('user_data');
};
