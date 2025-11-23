import { AppProviders } from '@/components/app-providers'
import { AppSplashController } from '@/components/app-splash-controller'
import { useAuth } from '@/components/auth/auth-provider'
import { useTrackLocations } from '@/hooks/use-track-locations'
import { PortalHost } from '@rn-primitives/portal'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { useCallback, useEffect } from 'react'
import { View } from 'react-native'
import 'react-native-reanimated'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  // Use this hook to track the locations for analytics or debugging.
  // Delete if you don't need it.
  useTrackLocations((pathname, params) => {
    console.log(`Track ${pathname}`, { params })
  })
  // Load IBM Plex fonts if available, otherwise use system fonts
  const [loaded] = useFonts({
    // IBM Plex fonts - add these files to assets/fonts/ when available
    // IBMPlexSans: require('../assets/fonts/IBMPlexSans-Regular.ttf'),
    // 'IBMPlexSans-Medium': require('../assets/fonts/IBMPlexSans-Medium.ttf'),
    // 'IBMPlexSans-SemiBold': require('../assets/fonts/IBMPlexSans-SemiBold.ttf'),
    // 'IBMPlexSans-Bold': require('../assets/fonts/IBMPlexSans-Bold.ttf'),
    // IBMPlexMono: require('../assets/fonts/IBMPlexMono-Regular.ttf'),
    // 'IBMPlexMono-Medium': require('../assets/fonts/IBMPlexMono-Medium.ttf'),
    // 'IBMPlexMono-SemiBold': require('../assets/fonts/IBMPlexMono-SemiBold.ttf'),
    
    // Temporary: Keep existing font for now
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  })

  const onLayoutRootView = useCallback(async () => {
    console.log('onLayoutRootView')
    if (loaded) {
      console.log('loaded')
      // Hide splash screen once fonts are loaded
      // AppSplashController will handle hiding when auth is ready
      await SplashScreen.hideAsync()
    }
  }, [loaded])

  // Hide splash screen when fonts are ready
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  // Return a minimal view instead of null to avoid Fabric mounting issues
  if (!loaded) {
    return <View style={{ flex: 1 }} />
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <AppProviders>
        <AppSplashController />
        <RootNavigator />
        <StatusBar style="auto" />
      </AppProviders>
      <PortalHost />
    </View>
  )
}

function RootNavigator() {
  const { isAuthenticated } = useAuth()
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack.Protected>
      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen name="sign-in" />
      </Stack.Protected>
    </Stack>
  )
}
