// Color palette for the application
export const Colors = {
  // Primary colors
  primary: '#1CC29F',
  primaryDark: '#0F766E',
  primaryLight: '#5BC5A7',
  
  // Secondary colors
  secondary: '#8B5CF6',
  secondaryLight: '#A78BFA',
  
  // Neutral colors
  white: '#FFFFFF',
  black: '#000000',
  
  // Gray scale
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
  
  // Slate scale
  slate50: '#F8F9FA',
  slate100: '#F1F5F9',
  slate200: '#E2E8F0',
  slate300: '#CBD5E1',
  slate400: '#94A3B8',
  slate500: '#64748B',
  slate600: '#475569',
  slate700: '#334155',
  slate800: '#1E293B',
  slate900: '#0F172A',
  
  // Functional colors
  success: '#10B981',
  successLight: '#D1FAE5',
  error: '#EF4444',
  errorLight: '#FEF2F2',
  errorBorder: '#FECACA',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  info: '#3B82F6',
  infoLight: '#DBEAFE',
  
  // Special colors
  green: '#16A34A',
  greenLight: '#DCFCE7',
  blue: '#007AFF',
  blueLight: '#4285F4',
  orange: '#FF6B35',
  red: '#DC2626',
  purple: '#8B5CF6',
  
  // Background colors
  background: '#FFFFFF',
  backgroundGray: '#F9FAFB',
  backgroundLight: '#FAFAFA',
  
  // Border colors
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  borderDark: '#D1D5DB',
  
  // Text colors
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  textLight: '#FFFFFF',
  textDark: '#111827',
  
  // Shadow colors
  shadow: '#000000',
  
  // Icon colors
  iconPrimary: '#374151',
  iconSecondary: '#6B7280',
  iconTertiary: '#9CA3AF',
  
  // Dark mode colors (for future use)
  dark: {
    background: '#111827',
    surface: '#1F2937',
    text: '#F9FAFB',
    textSecondary: '#9CA3AF',
  },
} as const;

export type ColorKey = keyof typeof Colors;

