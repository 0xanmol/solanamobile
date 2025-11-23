import { Colors } from '@/constants/colors'
import { BlurView } from 'expo-blur'
import React, { PropsWithChildren, useMemo } from 'react'
import { StyleSheet, useColorScheme, View, ViewStyle } from 'react-native'

type GlassCardProps = PropsWithChildren<{
  style?: ViewStyle
}>

export function GlassCard({ children, style }: GlassCardProps) {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'
  const colors = Colors[isDark ? 'dark' : 'light']

  const shadowStyle = useMemo(
    () => ({
      shadowColor: isDark ? '#000000' : '#0F172A',
      shadowOpacity: isDark ? 0.35 : 0.08,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 12 },
      elevation: isDark ? 2 : 6,
    }),
    [isDark],
  )

  return (
    <View style={[styles.container, shadowStyle, style]}>
      <BlurView intensity={isDark ? 28 : 20} tint={isDark ? 'dark' : 'light'} style={styles.blur}>
        <View
          style={[
            styles.innerCard,
            {
              backgroundColor: isDark ? 'rgba(8,9,11,0.78)' : 'rgba(255,255,255,0.85)',
              borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)',
            },
          ]}
        >
          {children}
        </View>
      </BlurView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
  },
  blur: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  innerCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
})


