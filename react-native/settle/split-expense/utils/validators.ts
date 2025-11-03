/**
 * Utility functions for validation
 */

/**
 * Validate email format
 * @param email - Email address to validate
 * @returns true if valid, false otherwise
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number format
 * @param phone - Phone number to validate
 * @returns true if valid, false otherwise
 */
export const isValidPhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10 && cleaned.length <= 15;
};

/**
 * Validate password strength
 * @param password - Password to validate
 * @returns Object with validation result and message
 */
export const validatePassword = (password: string): { isValid: boolean; message?: string } => {
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters' };
  }
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one lowercase letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one number' };
  }
  return { isValid: true };
};

/**
 * Validate numeric input
 * @param value - Value to validate
 * @returns true if valid number, false otherwise
 */
export const isValidNumber = (value: string): boolean => {
  const numRegex = /^-?\d*\.?\d*$/;
  return numRegex.test(value) && value !== '-' && value !== '.';
};

/**
 * Validate currency amount
 * @param amount - Amount to validate
 * @returns true if valid amount, false otherwise
 */
export const isValidAmount = (amount: string): boolean => {
  const amountRegex = /^\d+(\.\d{0,2})?$/;
  return amountRegex.test(amount) && parseFloat(amount) > 0;
};

/**
 * Sanitize input text
 * @param text - Text to sanitize
 * @returns Sanitized text
 */
export const sanitizeInput = (text: string): string => {
  return text.trim().replace(/\s+/g, ' ');
};

