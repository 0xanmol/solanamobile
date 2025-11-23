import { CustomTabBar } from '@/components/tab-bar/custom-tab-bar'
import { ScrollProvider } from '@/components/tab-bar/scroll-context'
import { Tabs } from 'expo-router'
import React from 'react'

export default function TabLayout() {
  return (
    <ScrollProvider>
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarBackground: () => null,
        tabBarStyle: {
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          position: 'absolute',
          paddingTop: 0,
          paddingBottom: 0,
          marginTop: 0,
          marginBottom: 0,
        },
      }}
    >
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="pots" options={{ title: 'Pots' }} />
      <Tabs.Screen name="friends" options={{ title: 'Friends' }} />
      <Tabs.Screen name="activity" options={{ title: 'Activity' }} />
      <Tabs.Screen name="account" options={{ title: 'Account' }} />
      <Tabs.Screen name="settings" options={{ href: null }} />
      <Tabs.Screen name="demo" options={{ href: null }} />
    </Tabs>
    </ScrollProvider>
  )
}
