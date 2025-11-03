/**
 * Utility functions for formatting data
 */

/**
 * Format a number as currency
 * @param amount - The amount to format
 * @param currency - Currency code (default: USD)
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format a date to a readable string
 * @param date - The date to format
 * @param format - Format type ('short', 'long', 'time')
 * @returns Formatted date string
 */
export const formatDate = (date: Date, format: 'short' | 'long' | 'time' = 'short'): string => {
  if (format === 'time') {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  
  if (format === 'long') {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Format a phone number
 * @param phone - The phone number to format
 * @returns Formatted phone number
 */
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format for US numbers
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  // Return as-is if not a standard format
  return phone;
};

/**
 * Truncate text with ellipsis
 * @param text - The text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

/**
 * Get initials from a name
 * @param name - Full name
 * @returns Initials (up to 2 characters)
 */
export const getInitials = (name: string): string => {
  const parts = name.trim().split(' ');
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

/**
 * Calculate percentage
 * @param value - The value
 * @param total - The total
 * @returns Percentage (0-100)
 */
export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return (value / total) * 100;
};

/**
 * Format a relative time (e.g., "2 days ago")
 * @param date - The date to format
 * @returns Relative time string
 */
export const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
  return `${Math.floor(diffDays / 365)}y ago`;
};

