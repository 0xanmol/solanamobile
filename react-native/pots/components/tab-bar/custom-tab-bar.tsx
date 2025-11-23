import { UiIconSymbolName } from '@/components/ui/ui-icon-symbol'
import { Colors } from '@/constants/colors'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { usePathname } from 'expo-router'
import React, { useEffect, useMemo, useState } from 'react'
import { Animated, StyleSheet, useColorScheme, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { CustomTabBarButton } from './custom-tab-bar-button'
import { useScrollContext } from './scroll-context'

const TAB_ITEMS: Array<{ route: string; icon: UiIconSymbolName; label: string }> = [
  { route: 'pots', icon: 'cauldron.fill' as UiIconSymbolName, label: 'Pots' },
  { route: 'friends', icon: 'person.2.fill' as UiIconSymbolName, label: 'Friends' },
  { route: 'activity', icon: 'bell.fill' as UiIconSymbolName, label: 'Activity' },
  { route: 'account', icon: 'person.fill' as UiIconSymbolName, label: 'Account' },
]

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets()
  const [activeIndex, setActiveIndex] = useState(state.index)
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'
  const theme = Colors[isDark ? 'dark' : 'light']
  const accentColor = theme.accentGreen ?? '#22E1A2'
  const pathname = usePathname()
  
  // Get scroll context for hide/show animation
  let translateY: Animated.Value
  try {
    const scrollContext = useScrollContext()
    translateY = scrollContext.translateY
  } catch {
    // Fallback if not in ScrollProvider
    translateY = new Animated.Value(0)
  }
  
  // Check if we're on a screen that should hide the tab bar (e.g., create pot page)
  const currentRoute = state.routes[state.index]
  const routeName = currentRoute?.name || ''
  const routePath = currentRoute?.path || ''
  
  const shouldHideTabBar = pathname?.includes('/create') ||
                          routeName.toLowerCase().includes('create') || 
                          routePath.toLowerCase().includes('create')
  
  // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS
  const visibleRoutes = useMemo(
    () =>
      state.routes
        .filter((route) => TAB_ITEMS.find((item) => item.route === route.name))
        .sort((a, b) => TAB_ITEMS.findIndex((item) => item.route === a.name) - TAB_ITEMS.findIndex((item) => item.route === b.name)),
    [state.routes],
  )

  useEffect(() => {
    setActiveIndex(state.index)
  }, [state.index])

  // If we should hide the tab bar, translate it completely off-screen
  useEffect(() => {
    if (shouldHideTabBar) {
      Animated.timing(translateY, {
        toValue: 200, // Move completely off-screen
        duration: 250,
        useNativeDriver: true,
      }).start()
    } else {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start()
    }
  }, [shouldHideTabBar, translateY])
  
  // Don't render if we should hide (but all hooks have been called)
  if (shouldHideTabBar) {
    return null
  }

  const backgroundColor = isDark ? 'rgba(5,9,15,0.98)' : 'rgba(255,255,255,0.98)'
  const borderColor = isDark ? theme.borderMuted : theme.border
  const shadowColor = theme.shadowSoft
  const tabBarHeight = 62 + Math.max(insets.bottom, 8)

  return (
        <View
      style={[
        styles.wrapper,
        {
          height: tabBarHeight + 30, // Extra height to allow for translation off-screen
          overflow: 'hidden',
        },
      ]}
    >
      <Animated.View
          style={[
        styles.container,
            {
          backgroundColor,
          borderTopColor: borderColor,
          paddingBottom: Math.max(insets.bottom, 8),
          shadowColor,
          shadowOpacity: isDark ? 0.35 : 0.12,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: -6 },
          elevation: isDark ? 12 : 8,
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            transform: [{ translateY }],
            },
          ]}
    >
      {visibleRoutes.map((route) => {
        const descriptor = descriptors[route.key]
        const tabMeta = TAB_ITEMS.find((item) => item.route === route.name)
        if (!tabMeta) {
          return null
        }

        const routeIndex = state.routes.findIndex((r) => r.key === route.key)
        const isRouteFocused = state.index === routeIndex
        const isActive = activeIndex === routeIndex

        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true })
          if (!isRouteFocused && !event.defaultPrevented) {
            setActiveIndex(routeIndex)
            navigation.navigate(route.name, route.params)
          }
        }

        const onLongPress = () => {
          navigation.emit({ type: 'tabLongPress', target: route.key })
        }

        if (descriptor.options.tabBarItemStyle && typeof descriptor.options.tabBarItemStyle === 'object' && 'display' in descriptor.options.tabBarItemStyle && descriptor.options.tabBarItemStyle.display === 'none') {
          return null
        }

        return (
          <CustomTabBarButton
            key={route.key}
            iconName={tabMeta.icon}
            label={tabMeta.label}
            isActive={isActive}
            onPress={onPress}
            onLongPress={onLongPress}
            accessibilityState={descriptor.options.tabBarAccessibilityLabel ? { selected: isRouteFocused } : undefined}
            accessibilityLabel={descriptor.options.tabBarAccessibilityLabel}
            accessibilityRole="button"
            testID={descriptor.options.tabBarButtonTestID}
            onPressIn={() => setActiveIndex(routeIndex)}
            accentColor={accentColor}
            isDark={isDark}
          />
        )
      })}
      </Animated.View>
      </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-around',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 8,
    paddingHorizontal: 0,
    minHeight: 62,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    overflow: 'hidden',
  },
})
