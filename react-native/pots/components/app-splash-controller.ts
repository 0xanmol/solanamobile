import { SplashScreen } from 'expo-router'
import { useAuth } from '@/components/auth/auth-provider'
import { useEffect } from 'react'

export function AppSplashController() {
  const { isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading) {
      // Only hide if not already hidden - this is a backup
      SplashScreen.hideAsync().catch(() => {
        // Ignore errors if already hidden
      })
    }
  }, [isLoading])

  return null
}
