/**
 * Authentication API
 * Mock implementations that log request/response data
 */

export interface SignupData {
  fullName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  profileImage?: string;
  currency?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user?: {
    id: string;
    name: string;
    email: string;
    profileImage?: string;
  };
  token?: string;
  message?: string;
}

/**
 * User signup/registration
 */
export const signup = async (data: SignupData): Promise<AuthResponse> => {
  const request = {
    endpoint: 'POST /api/auth/signup',
    body: data,
  };
  console.log('[API] Request:', request);

  const response: AuthResponse = {
    success: true,
    user: {
      id: 'user_' + Date.now(),
      name: data.fullName,
      email: data.email,
      profileImage: data.profileImage,
    },
    token: 'mock_jwt_token_' + Date.now(),
    message: 'Account created successfully',
  };
  console.log('[API] Response:', response);

  return Promise.resolve(response);
};

/**
 * Email/password login
 */
export const login = async (data: LoginData): Promise<AuthResponse> => {
  const request = {
    endpoint: 'POST /api/auth/login',
    body: data,
  };
  console.log('[API] Request:', request);

  const response: AuthResponse = {
    success: true,
    user: {
      id: 'user_123',
      name: 'Sai Kumar',
      email: data.email,
    },
    token: 'mock_jwt_token_' + Date.now(),
    message: 'Login successful',
  };
  console.log('[API] Response:', response);

  return Promise.resolve(response);
};

/**
 * Google OAuth sign-in
 */
export const googleSignIn = async (): Promise<AuthResponse> => {
  const request = {
    endpoint: 'POST /api/auth/google',
    body: {},
  };
  console.log('[API] Request:', request);

  const response: AuthResponse = {
    success: true,
    user: {
      id: 'user_google_123',
      name: 'Google User',
      email: 'user@gmail.com',
    },
    token: 'mock_google_jwt_token_' + Date.now(),
    message: 'Google sign-in successful',
  };
  console.log('[API] Response:', response);

  return Promise.resolve(response);
};

/**
 * User logout
 */
export const logout = async (): Promise<{ success: boolean; message: string }> => {
  const request = {
    endpoint: 'POST /api/auth/logout',
    body: {},
  };
  console.log('[API] Request:', request);

  const response = {
    success: true,
    message: 'Logged out successfully',
  };
  console.log('[API] Response:', response);

  return Promise.resolve(response);
};

/**
 * Forgot password
 */
export const forgotPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
  const request = {
    endpoint: 'POST /api/auth/forgot-password',
    body: { email },
  };
  console.log('[API] Request:', request);

  const response = {
    success: true,
    message: 'Password reset link sent to email',
  };
  console.log('[API] Response:', response);

  return Promise.resolve(response);
};

