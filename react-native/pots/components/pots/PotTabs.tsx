import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { AppText } from '@/components/app-text'

interface PotTabsProps {
  activeTab: 'contributions' | 'contributors'
  contributionsCount: number
  contributorsCount: number
  colors: any
  onTabChange: (tab: 'contributions' | 'contributors') => void
}

export function PotTabs({
  activeTab,
  contributionsCount,
  contributorsCount,
  colors,
  onTabChange,
}: PotTabsProps) {
  return (
    <View style={styles.tabContainer}>
      <TouchableOpacity
        style={[
          styles.tab,
          activeTab === 'contributions' && styles.tabActive,
          { borderBottomColor: activeTab === 'contributions' ? colors.accentGreen : 'transparent' },
        ]}
        onPress={() => onTabChange('contributions')}
      >
        <AppText
          style={[
            styles.tabText,
            { color: activeTab === 'contributions' ? colors.accentGreen : colors.textSecondary },
          ]}
        >
          Contributions ({contributionsCount})
        </AppText>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.tab,
          activeTab === 'contributors' && styles.tabActive,
          { borderBottomColor: activeTab === 'contributors' ? colors.accentGreen : 'transparent' },
        ]}
        onPress={() => onTabChange('contributors')}
      >
        <AppText
          style={[
            styles.tabText,
            { color: activeTab === 'contributors' ? colors.accentGreen : colors.textSecondary },
          ]}
        >
          Contributors ({contributorsCount})
        </AppText>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 2,
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
})

