import React, { createContext, useContext, useRef, useState, useCallback } from 'react'
import { Animated } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface ScrollContextType {
  scrollY: Animated.Value
  handleScroll: (event: any) => void
  translateY: Animated.Value
  isVisible: boolean
}

const ScrollContext = createContext<ScrollContextType | null>(null)

export function ScrollProvider({ children }: { children: React.ReactNode }) {
  const insets = useSafeAreaInsets()
  const scrollY = useRef(new Animated.Value(0)).current
  const translateY = useRef(new Animated.Value(0)).current
  const [isVisible, setIsVisible] = useState(true)
  const lastScrollY = useRef(0)
  const scrollThreshold = 10
  // Calculate tab bar height (approximately 62 + bottom inset)
  const tabBarHeight = 62 + Math.max(insets.bottom, 8)

  const handleScroll = useCallback((event: any) => {
    const currentScrollY = event.nativeEvent.contentOffset.y
    const scrollDifference = currentScrollY - lastScrollY.current

    if (Math.abs(scrollDifference) > scrollThreshold) {
      if (scrollDifference > 0 && currentScrollY > 50) {
        // Scrolling down - hide tab bar (translate down completely off-screen)
        if (isVisible) {
          setIsVisible(false)
          Animated.timing(translateY, {
            toValue: tabBarHeight + 20, // Add extra padding to ensure it's completely off-screen
            duration: 250,
            useNativeDriver: true,
          }).start()
        }
      } else if (scrollDifference < 0) {
        // Scrolling up - show tab bar (translate back up)
        if (!isVisible) {
          setIsVisible(true)
          Animated.timing(translateY, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
          }).start()
        }
      }
      lastScrollY.current = currentScrollY
    }
  }, [isVisible, translateY, tabBarHeight])

  return (
    <ScrollContext.Provider value={{ scrollY, handleScroll, translateY, isVisible }}>
      {children}
    </ScrollContext.Provider>
  )
}

export function useScrollContext() {
  const context = useContext(ScrollContext)
  if (!context) {
    throw new Error('useScrollContext must be used within ScrollProvider')
  }
  return context
}

