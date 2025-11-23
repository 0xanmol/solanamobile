import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { AppText } from '@/components/app-text'
import { Contribution } from '@/store/app-store'
import { Fonts } from '@/constants/fonts'

interface ContributionListProps {
  contributions: Contribution[]
  getContributorName: (address: string) => string
  colors: any
}

export function ContributionList({ contributions, getContributorName, colors }: ContributionListProps) {
  if (contributions.length === 0) {
    return <AppText style={[styles.emptyText, { color: colors.textSecondary }]}>No contributions yet</AppText>
  }

  return (
    <View style={styles.tabContent}>
      {contributions.map((contribution) => (
        <View key={contribution.id} style={styles.listItem}>
          <View style={[styles.avatar, { backgroundColor: colors.accentPurple }]}>
            <Text style={styles.avatarText}>
              {getContributorName(contribution.contributorAddress)[0].toUpperCase()}
            </Text>
          </View>
          <View style={styles.listItemInfo}>
            <AppText style={styles.listItemName}>{getContributorName(contribution.contributorAddress)}</AppText>
            <AppText style={[styles.listItemSubtext, { color: colors.textSecondary }]}>
              {contribution.timestamp.toLocaleString()}
            </AppText>
          </View>
          <AppText style={[styles.listItemAmount, { color: colors.accentGreen }]}>
            +{contribution.amount.toFixed(2)} {contribution.currency}
          </AppText>
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
    fontFamily: Fonts.mono,
  },
  listItemAmount: {
    fontSize: 15,
    fontWeight: '600',
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
  emptyText: {
    fontSize: 13,
    textAlign: 'center',
    padding: 20,
  },
})

