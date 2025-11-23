import { useMemo } from 'react'
import { useColorScheme } from 'react-native'
import { Colors } from '@/constants/colors'

export function useAppTheme() {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'
  const colors = Colors[isDark ? 'dark' : 'light']

  const palette = useMemo(
    () => ({
      gradient: (isDark ? ['#05070E', '#04060A', '#030407'] : ['#EEF1FF', '#F8FAFF', '#FFFFFF']) as [string, string, string],
      surface: isDark ? 'rgba(12,14,21,0.94)' : '#FFFFFF',
      surfaceMuted: isDark ? 'rgba(255,255,255,0.05)' : '#F3F6FF',
      border: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)',
      label: isDark ? 'rgba(255,255,255,0.65)' : '#76809A',
      text: colors.text,
      textSecondary: colors.textSecondary,
      accent: colors.accentGreen ?? '#22E1A2',
      accentSecondary: '#6DF8CD',
      accentMuted: isDark ? 'rgba(34,225,162,0.18)' : 'rgba(34,225,162,0.12)',
      chipAvatarBg: isDark ? '#0C1525' : '#E2E7FF',
      chipAvatarText: isDark ? '#66F5C6' : '#1A1F2C',
    }),
    [isDark, colors],
  )

  const cardStyle = useMemo(
    () => ({
      backgroundColor: palette.surface,
      borderColor: palette.border,
      shadowColor: isDark ? '#000000' : '#9FB4FF',
      shadowOpacity: isDark ? 0.35 : 0.12,
      shadowRadius: 24,
      shadowOffset: { width: 0, height: 12 },
      elevation: isDark ? 2 : 6,
    }),
    [palette, isDark],
  )

  const inputBaseStyle = useMemo(
    () => ({
      backgroundColor: palette.surfaceMuted,
      borderColor: palette.border,
      color: palette.text,
    }),
    [palette],
  )

  return {
    palette,
    cardStyle,
    inputBaseStyle,
    isDark,
    colors,
  }
}

