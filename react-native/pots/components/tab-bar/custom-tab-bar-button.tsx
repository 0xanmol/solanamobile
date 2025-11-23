import { UiIconSymbol, UiIconSymbolName } from '@/components/ui/ui-icon-symbol'
import React, { memo } from 'react'
import { AccessibilityState, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

interface CustomTabBarButtonProps {
  iconName: string
  label: string
  isActive: boolean
  onPress: () => void
  onPressIn?: () => void
  onLongPress?: () => void
  accessibilityState?: AccessibilityState
  accessibilityLabel?: string
  accessibilityRole?: string
  testID?: string
  accentColor?: string
  isDark: boolean
}

// Helper to convert filled icon names to outlined versions
function getIconName(iconName: string, isActive: boolean): UiIconSymbolName {
  if (isActive) {
    // Return filled version when active
    return iconName as UiIconSymbolName
  }
  // Convert filled to outlined by removing .fill suffix
  const outlinedName = iconName.replace('.fill', '') as UiIconSymbolName
  return outlinedName
}

function CustomTabBarButtonComponent({
  iconName,
  label,
  isActive,
  onPress,
  onPressIn,
  onLongPress,
  accessibilityState,
  accessibilityLabel,
  accessibilityRole,
  testID,
  accentColor = '#22E1A2',
  isDark,
}: CustomTabBarButtonProps) {
  const computedLabel = accessibilityLabel ?? label
  
  const iconColor = isActive 
    ? accentColor 
    : isDark 
      ? 'rgba(255,255,255,0.55)' 
      : 'rgba(0,0,0,0.5)'

  const labelColor = isActive
    ? accentColor
    : isDark
      ? 'rgba(255,255,255,0.5)'
      : 'rgba(0,0,0,0.5)'

  // Get the appropriate icon (outlined when inactive, filled when active)
  const displayIconName = getIconName(iconName, isActive)

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={onPressIn}
      onLongPress={onLongPress}
      style={styles.button}
      activeOpacity={0.7}
      accessibilityState={accessibilityState}
      accessibilityLabel={computedLabel}
      accessibilityRole={accessibilityRole as any}
      testID={testID}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <UiIconSymbol 
            size={22} 
            name={displayIconName} 
            color={iconColor} 
          />
          {isActive && (
            <View style={[styles.activeIndicator, { backgroundColor: accentColor }]} />
          )}
        </View>
        <Text 
          style={[
            styles.label,
            { color: labelColor },
            isActive && styles.labelActive
          ]}
          numberOfLines={1}
        >
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

function propsAreEqual(prev: CustomTabBarButtonProps, next: CustomTabBarButtonProps) {
  return (
    prev.iconName === next.iconName &&
    prev.label === next.label &&
    prev.isActive === next.isActive &&
    prev.accentColor === next.accentColor &&
    prev.isDark === next.isDark &&
    prev.accessibilityLabel === next.accessibilityLabel &&
    prev.testID === next.testID
  )
}

export const CustomTabBarButton = memo(CustomTabBarButtonComponent, propsAreEqual)

const styles = StyleSheet.create({
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    minHeight: 56,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  iconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 3,
    width: 28,
    height: 28,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -7,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  label: {
    fontSize: 10.5,
    fontFamily: 'IBMPlexSans-Medium',
    letterSpacing: -0.2,
    marginTop: 0,
  },
  labelActive: {
    fontFamily: 'IBMPlexSans-SemiBold',
  },
})
