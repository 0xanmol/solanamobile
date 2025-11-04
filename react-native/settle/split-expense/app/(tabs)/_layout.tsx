import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Tabs } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HapticTab } from '@/components/haptic-tab';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tint,
        tabBarInactiveTintColor: colors.tabIconDefault,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          height: 75 + insets.bottom,
          paddingBottom: 16 + insets.bottom,
          paddingTop: 8,
          paddingHorizontal: 20,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          marginTop: 6,
          fontFamily: 'Montserrat_500Medium',
        },
        tabBarScrollEnabled: true,
        tabBarAllowFontScaling: false,
      }}>
      <Tabs.Screen
        name="groups"
        options={{
          title: 'Groups',
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <MaterialIcons 
                size={24} 
                name="group" 
                color={color} 
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="friends"
        options={{
          title: 'Friends',
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <MaterialIcons 
                size={24} 
                name="person" 
                color={color} 
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: 'Activity',
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <MaterialIcons 
                size={24} 
                name="timeline" 
                color={color} 
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <View style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: focused ? colors.text : 'transparent',
                borderWidth: 2,
                borderColor: focused ? colors.tint : 'transparent',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <MaterialIcons
                  size={16}
                  name="account-circle"
                  color={focused ? colors.background : color}
                />
              </View>
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
