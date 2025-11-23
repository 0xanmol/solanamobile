import { PropsWithChildren } from 'react'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useColorScheme } from 'react-native'
import { Colors } from '@/constants/colors'

export function useAppTheme() {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'
  const colors = Colors[isDark ? 'dark' : 'light']

  const theme = isDark
    ? {
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors,
          primary: colors.accentGreen,
          background: colors.background,
          card: colors.surface,
          text: colors.text,
          border: colors.border,
          notification: colors.accentPurple,
        },
      }
    : {
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          primary: colors.accentGreen,
          background: colors.background,
          card: colors.surface,
          text: colors.text,
          border: colors.border,
          notification: colors.accentPurple,
        },
      }

  return {
    colorScheme,
    isDark,
    theme,
    colors,
  }
}

export function AppTheme({ children }: PropsWithChildren) {
  const { theme } = useAppTheme()

  return <ThemeProvider value={theme}>{children}</ThemeProvider>
}
