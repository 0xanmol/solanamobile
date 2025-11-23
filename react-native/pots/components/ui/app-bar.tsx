import React from 'react'
import { StyleSheet, Text, TouchableOpacity, ViewStyle, View, Platform } from 'react-native'
import { useColorScheme } from 'react-native'
import { BlurView } from 'expo-blur'
import { Colors } from '@/constants/colors'
import { Fonts } from '@/constants/fonts'
import { UiIconSymbol, UiIconSymbolName } from '@/components/ui/ui-icon-symbol'

export type AppBarProps = {
  title: string
  subtitle?: string
  rightLabel?: string
  onRightPress?: () => void
  rightDisabled?: boolean
  style?: ViewStyle
  actions?: AppBarAction[]
}

type AppBarAction = {
  icon: UiIconSymbolName
  onPress?: () => void
  disabled?: boolean
}

const DEFAULT_ACTIONS: AppBarAction[] = [
  { icon: 'magnifyingglass' },
  { icon: 'text.bubble.fill' },
]

export function AppBar({ title, subtitle, rightLabel, onRightPress, rightDisabled, style, actions }: AppBarProps) {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'
  const colors = Colors[isDark ? 'dark' : 'light']
  const enableBlur = Platform.OS === 'ios'

  const titleInitial = title.slice(0, 2).toUpperCase()
  const resolvedActions = actions === undefined ? DEFAULT_ACTIONS : actions
  const barStyle = {
    backgroundColor: enableBlur ? (isDark ? 'rgba(8,9,11,0.6)' : 'rgba(255,255,255,0.2)') : colors.surface,
    borderColor: enableBlur ? (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)') : colors.borderMuted,
    shadowColor: isDark ? '#000' : '#101828',
  }

  const barContent = (
    <View style={[styles.bar, barStyle]}>
      <View style={[styles.iconContainer, { backgroundColor: colors.accentPurple + '22' }]}>
        <Text style={[styles.iconText, { color: colors.accentPurple }]}>{titleInitial}</Text>
      </View>

      <View style={styles.titleBlock}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={[styles.subtitle, { color: colors.textTertiary }]} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      <View style={styles.rightCluster}>
        {resolvedActions.map((action, index) => (
          <TouchableOpacity
            key={`${action.icon}-${index}`}
            onPress={action.onPress}
            disabled={action.disabled}
            style={[
              styles.iconButton,
              {
                borderColor: colors.borderMuted,
                backgroundColor: isDark ? colors.surfaceMuted : '#F9FAFB',
                opacity: action.disabled ? 0.4 : 1,
              },
            ]}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            activeOpacity={0.7}
          >
            <UiIconSymbol name={action.icon} size={18} color={colors.text} />
          </TouchableOpacity>
        ))}

        {rightLabel && onRightPress ? (
          <TouchableOpacity
            onPress={onRightPress}
            disabled={rightDisabled}
            style={[
              styles.ctaButton,
              { backgroundColor: rightDisabled ? colors.surfaceMuted : colors.accentGreen },
            ]}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.ctaLabel,
                { color: rightDisabled ? colors.textTertiary : '#041015' },
              ]}
            >
              {rightLabel}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  )

  return (
    <View style={[styles.container, style]}>
      {enableBlur ? (
        <BlurView intensity={isDark ? 28 : 20} tint={isDark ? 'dark' : 'light'} style={styles.blurContainer}>
          {barContent}
        </BlurView>
      ) : (
        barContent
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  blurContainer: {
    borderRadius: 18,
    overflow: 'hidden',
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 18,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  iconText: {
    fontSize: 16,
    fontFamily: 'IBMPlexSans-Bold',
    letterSpacing: -0.2,
  },
  titleBlock: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
    marginLeft: 12,
  },
  title: {
    fontSize: 17,
    fontFamily: 'IBMPlexSans-SemiBold',
    letterSpacing: -0.2,
    lineHeight: 22,
  },
  subtitle: {
    marginTop: 2,
    fontSize: 12,
    fontFamily: 'IBMPlexSans-Medium',
    letterSpacing: -0.1,
  },
  rightCluster: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
  },
  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaButton: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  ctaLabel: {
    fontSize: 13,
    fontFamily: 'IBMPlexSans-SemiBold',
    letterSpacing: 0.2,
  },
})



