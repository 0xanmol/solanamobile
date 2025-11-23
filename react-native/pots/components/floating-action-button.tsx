import { useAppTheme } from '@/hooks/use-app-theme'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { useRouter } from 'expo-router'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Animated, StyleSheet, TouchableOpacity } from 'react-native'

interface FloatingActionButtonProps {
  scrollY?: Animated.Value
}

export function FloatingActionButton({ scrollY }: FloatingActionButtonProps = {}) {
  const router = useRouter()
  const { palette } = useAppTheme()
  const [isVisible, setIsVisible] = useState(true)
  const lastScrollY = useRef(0)
  const scrollThreshold = 10
  const fadeAnim = useRef(new Animated.Value(1)).current
  const translateY = useRef(new Animated.Value(0)).current

  const handlePress = () => {
    router.push('/(tabs)/pots/create')
  }

  useEffect(() => {
    if (scrollY) {
      const listener = scrollY.addListener(({ value }) => {
        const scrollDifference = value - lastScrollY.current

        if (Math.abs(scrollDifference) > scrollThreshold) {
          if (scrollDifference > 0 && value > 50) {
            // Scrolling down - hide
            if (isVisible) {
              setIsVisible(false)
              Animated.parallel([
                Animated.timing(fadeAnim, {
                  toValue: 0,
                  duration: 200,
                  useNativeDriver: true,
                }),
                Animated.timing(translateY, {
                  toValue: 100,
                  duration: 200,
                  useNativeDriver: true,
                }),
              ]).start()
            }
          } else if (scrollDifference < 0) {
            // Scrolling up - show
            if (!isVisible) {
              setIsVisible(true)
              Animated.parallel([
                Animated.timing(fadeAnim, {
                  toValue: 1,
                  duration: 200,
                  useNativeDriver: true,
                }),
                Animated.timing(translateY, {
                  toValue: 0,
                  duration: 200,
                  useNativeDriver: true,
                }),
              ]).start()
            }
          }
          lastScrollY.current = value
        }
      })

      return () => {
        scrollY.removeListener(listener)
      }
    }
  }, [scrollY, isVisible, fadeAnim, translateY])

  return (
    <Animated.View
      style={[
        styles.fab,
        { backgroundColor: palette.accent },
        {
          opacity: fadeAnim,
          transform: [{ translateY }],
        },
      ]}
    >
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.8}
        style={styles.fabTouchable}
      >
        <MaterialIcons name="add" size={28} color="#041015" />
      </TouchableOpacity>
    </Animated.View>
  )
}

// Hook for scroll-based FAB visibility
export function useFABVisibility() {
  const [isVisible, setIsVisible] = useState(true)
  const lastScrollY = useRef(0)
  const scrollThreshold = 10
  const fadeAnim = useRef(new Animated.Value(1)).current
  const translateY = useRef(new Animated.Value(0)).current

  const handleScroll = useCallback((event: any) => {
    const currentScrollY = event.nativeEvent.contentOffset.y
    const scrollDifference = currentScrollY - lastScrollY.current

    if (Math.abs(scrollDifference) > scrollThreshold) {
      if (scrollDifference > 0 && currentScrollY > 50) {
        // Scrolling down - hide
        if (isVisible) {
          setIsVisible(false)
          Animated.parallel([
            Animated.timing(fadeAnim, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(translateY, {
              toValue: 100,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start()
        }
      } else if (scrollDifference < 0) {
        // Scrolling up - show
        if (!isVisible) {
          setIsVisible(true)
          Animated.parallel([
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(translateY, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start()
        }
      }
      lastScrollY.current = currentScrollY
    }
  }, [isVisible, fadeAnim, translateY])

  return { isVisible, handleScroll, fadeAnim, translateY }
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 30,
    bottom: 80,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
  },
  fabTouchable: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
})
