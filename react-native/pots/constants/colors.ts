/**
 * Premium mint / obsidian palette inspired by Apple UI detailing.
 * Every screen should source colors from this file to ensure
 * visual consistency across surfaces, typography, and interactive elements.
 */

type AccentPalette = {
  primary: string
  secondary: string
  tertiary: string
  amber: string
  success: string
  danger: string
}

type ThemeTokens = {
  background: string
  surface: string
  surfaceMuted: string
  cardBackground: string
  overlay: string
  glass: string
  border: string
  borderMuted: string
  textPrimary: string
  textSecondary: string
  textMuted: string
  icon: string
  tabIconDefault: string
  tabIconSelected: string
  tint: string
  accentGreen: string
  accentPurple: string
  accentAmber: string
  success: string
  warning: string
  danger: string
  gradientMint: [string, string]
  gradientLavender: [string, string]
  shadowStrong: string
  shadowSoft: string
}

const accent: AccentPalette = {
  primary: '#1FD6A0', // Mint (darker)
  secondary: '#8C6CFF', // Lavender (deeper)
  tertiary: '#E5AE63', // Champagne (warmer)
  amber: '#F5A94F',
  success: '#3EC38C',
  danger: '#FF6C79',
}

const darkTheme: ThemeTokens = {
  background: '#01070F',
  surface: '#040A12',
  surfaceMuted: '#080E18',
  cardBackground: '#0B121C',
  overlay: 'rgba(1,7,15,0.85)',
  glass: 'rgba(255,255,255,0.028)',
  border: '#111A27',
  borderMuted: '#192334',
  textPrimary: '#F4F7FD',
  textSecondary: '#BEC8D9',
  textMuted: '#8B97AD',
  icon: '#A5B1C6',
  tabIconDefault: '#718099',
  tabIconSelected: accent.primary,
  tint: accent.primary,
  accentGreen: accent.primary,
  accentPurple: accent.secondary,
  accentAmber: accent.tertiary,
  success: accent.success,
  warning: accent.amber,
  danger: accent.danger,
  gradientMint: ['#29E0B1', '#0FB586'],
  gradientLavender: ['#B992FF', '#7242FF'],
  shadowStrong: 'rgba(0,0,0,0.58)',
  shadowSoft: 'rgba(0,0,0,0.2)',
}

const lightTheme: ThemeTokens = {
  background: '#EDF2FB',
  surface: '#FAFBFE',
  surfaceMuted: '#E1E7F2',
  cardBackground: '#FFFFFF',
  overlay: 'rgba(15,23,42,0.08)',
  glass: 'rgba(10,20,30,0.04)',
  border: '#D9E1F0',
  borderMuted: '#C7D0E3',
  textPrimary: '#0A101A',
  textSecondary: '#434C5C',
  textMuted: '#7C879D',
  icon: '#636C80',
  tabIconDefault: '#80889B',
  tabIconSelected: accent.primary,
  tint: accent.primary,
  accentGreen: accent.primary,
  accentPurple: accent.secondary,
  accentAmber: accent.tertiary,
  success: '#1FC182',
  warning: '#E48F2F',
  danger: accent.danger,
  gradientMint: ['#2FD8AC', '#0DAE7E'],
  gradientLavender: ['#B190FF', '#7140FF'],
  shadowStrong: 'rgba(13,17,23,0.12)',
  shadowSoft: 'rgba(13,17,23,0.06)',
}

export const Colors = {
  light: {
    ...lightTheme,
    text: lightTheme.textPrimary,
    textTertiary: lightTheme.textMuted,
  },
  dark: {
    ...darkTheme,
    text: darkTheme.textPrimary,
    textTertiary: darkTheme.textMuted,
    cardOverlay: 'rgba(255,255,255,0.03)',
  },
} as const

export type ColorMode = keyof typeof Colors
export type AppColorTheme = (typeof Colors)[ColorMode]
