// Spacing constants for consistent layout
export const Spacing = {
  // Extra small
  xs: 4,
  // Small
  sm: 8,
  // Medium
  md: 12,
  // Large
  lg: 16,
  // Extra large
  xl: 20,
  // 2xl
  '2xl': 24,
  // 3xl
  '3xl': 32,
  // 4xl
  '4xl': 40,
  // 5xl
  '5xl': 48,
  // 6xl
  '6xl': 60,
} as const;

export const BorderRadius = {
  // Small
  sm: 4,
  // Medium
  md: 6,
  // Base
  base: 8,
  // Large
  lg: 10,
  // Extra large
  xl: 12,
  // 2xl
  '2xl': 16,
  // 3xl
  '3xl': 20,
  // Full circle
  full: 9999,
} as const;

export const Shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  base: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
} as const;

