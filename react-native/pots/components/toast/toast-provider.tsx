import { Colors } from '@/constants/colors'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { Portal } from '@rn-primitives/portal'
import React, {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type ToastType = 'success' | 'info' | 'warning' | 'error'

export type ToastOptions = {
  title: string
  message?: string
  type?: ToastType
  duration?: number
}

type ToastItem = Required<Pick<ToastOptions, 'title'>> &
  ToastOptions & {
    id: string
    type: ToastType
    duration: number
  }

type ToastContextValue = {
  showToast: (options: ToastOptions) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

export function ToastProvider({ children }: PropsWithChildren) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback(
    (options: ToastOptions) => {
      if (!options.title) {
        return
      }
      const id = `toast-${Date.now()}-${Math.random()}`
      setToasts((prev) => [
        ...prev,
        {
          id,
          title: options.title,
          message: options.message,
          type: options.type ?? 'info',
          duration: options.duration ?? 2600,
        },
      ])
    },
    [],
  )

  const value = useMemo(() => ({ showToast }), [showToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onFinish={removeToast} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return ctx
}

type ToastViewportProps = {
  toasts: ToastItem[]
  onFinish: (id: string) => void
}

function ToastViewport({ toasts, onFinish }: ToastViewportProps) {
  const insets = useSafeAreaInsets()
  return (
    <Portal>
      <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
        <View style={[styles.stack, { top: (insets.top || 16) + 12 }]}>
          {toasts.map((toast) => (
            <ToastCard key={toast.id} toast={toast} onFinish={() => onFinish(toast.id)} />
          ))}
        </View>
      </View>
    </Portal>
  )
}

type ToastCardProps = {
  toast: ToastItem
  onFinish: () => void
}

function ToastCard({ toast, onFinish }: ToastCardProps) {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'
  const colors = Colors[isDark ? 'dark' : 'light']
  const translateY = useRef(new Animated.Value(12)).current
  const opacity = useRef(new Animated.Value(0)).current
  const closingRef = useRef(false)

  const palette = useMemo(() => {
    const surfaceBackground = isDark ? colors.surface : '#FFFFFF'
    switch (toast.type) {
      case 'success':
        return {
          icon: 'check',
          accent: colors.accentGreen,
          background: surfaceBackground,
          badgeBackground: `${colors.accentGreen}1F`,
        }
      case 'error':
        return {
          icon: 'error-outline',
          accent: '#FF6B6B',
          background: surfaceBackground,
          badgeBackground: '#FF6B6B1F',
        }
      case 'warning':
        return {
          icon: 'warning-amber',
          accent: '#FFD93D',
          background: surfaceBackground,
          badgeBackground: '#FFD93D1F',
        }
      default:
        return {
          icon: 'notifications',
          accent: colors.accentPurple,
          background: surfaceBackground,
          badgeBackground: `${colors.accentPurple}1F`,
        }
    }
  }, [colors.accentGreen, colors.accentPurple, colors.surface, isDark, toast.type])

  const animateOut = useCallback(() => {
    if (closingRef.current) return
    closingRef.current = true
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 180,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 16,
        duration: 180,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(() => onFinish())
  }, [onFinish, opacity, translateY])

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        damping: 16,
        stiffness: 180,
      }),
    ]).start()

    const timeout = setTimeout(() => {
      animateOut()
    }, toast.duration)

    return () => {
      clearTimeout(timeout)
    }
  }, [animateOut, opacity, toast.duration, translateY])

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          backgroundColor: palette.background,
          borderColor: `${palette.accent}30`,
        },
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <View style={[styles.iconBadge, { backgroundColor: palette.badgeBackground ?? `${palette.accent}20` }]}>
        <MaterialIcons name={palette.icon as any} size={18} color={palette.accent} />
      </View>
      <View style={styles.textBlock}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          {toast.title}
        </Text>
        {!!toast.message && (
          <Text style={[styles.subtitle, { color: colors.textSecondary }]} numberOfLines={2}>
            {toast.message}
          </Text>
        )}
      </View>
      <TouchableOpacity onPress={animateOut} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <MaterialIcons name="close" size={16} color={colors.textSecondary} />
      </TouchableOpacity>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  stack: {
    position: 'absolute',
    width: '100%',
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 8,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    gap: 10,
    minWidth: '70%',
    maxWidth: 360,
    shadowColor: 'transparent',
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 },
    elevation: 0,
  },
  iconBadge: {
    width: 32,
    height: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
})

