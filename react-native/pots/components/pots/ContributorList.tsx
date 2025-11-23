import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { AppText } from '@/components/app-text'
import { ellipsify } from '@/utils/ellipsify'

interface ContributorListProps {
  contributors: string[]
  creatorAddress: string
  getContributorName: (address: string) => string
  colors: any
}

export function ContributorList({
  contributors,
  creatorAddress,
  getContributorName,
  colors,
}: ContributorListProps) {
  return (
    <View style={styles.tabContent}>
      {contributors.map((contributorAddress) => (
        <View key={contributorAddress} style={styles.listItem}>
          <View style={[styles.avatar, { backgroundColor: colors.accentPurple }]}>
            <Text style={styles.avatarText}>
              {getContributorName(contributorAddress)[0].toUpperCase()}
            </Text>
          </View>
          <View style={styles.listItemInfo}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <AppText style={styles.listItemName}>{getContributorName(contributorAddress)}</AppText>
              {contributorAddress === creatorAddress && (
                <View style={[styles.creatorBadge, { backgroundColor: colors.accentGreen }]}>
                  <Text style={styles.creatorBadgeText}>Creator</Text>
                </View>
              )}
            </View>
            <AppText style={[styles.listItemSubtext, { color: colors.textSecondary }]}>
              {ellipsify(contributorAddress, 12)}
            </AppText>
          </View>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  tabContent: {
    minHeight: 200,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  listItemInfo: {
    flex: 1,
    marginLeft: 10,
  },
  listItemName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  listItemSubtext: {
    fontSize: 11,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  creatorBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  creatorBadgeText: {
    color: '#000',
    fontSize: 9,
    fontWeight: '600',
  },
})

