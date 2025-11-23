import React from 'react'
import { View, StyleSheet } from 'react-native'
import { AppText } from '@/components/app-text'

interface PotProgressCardProps {
  progress: number
  totalContributed: number
  targetAmount: number
  currency: string
  colors: any
}

export function PotProgressCard({
  progress,
  totalContributed,
  targetAmount,
  currency,
  colors,
}: PotProgressCardProps) {
  return (
    <View style={[styles.progressCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
      <View style={styles.progressHeader}>
        <AppText style={[styles.progressLabel, { color: colors.textSecondary }]}>Progress</AppText>
        <AppText style={[styles.progressPercent, { color: colors.accentGreen }]}>{progress.toFixed(0)}%</AppText>
      </View>
      <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
        <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: colors.accentGreen }]} />
      </View>
      <View style={styles.progressInfo}>
        <AppText style={[styles.progressAmount, { color: colors.textSecondary }]}>
          {totalContributed.toFixed(2)} {currency} / {targetAmount.toFixed(2)} {currency}
        </AppText>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  progressCard: {
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  progressLabel: {
    fontSize: 13,
  },
  progressPercent: {
    fontSize: 16,
    fontWeight: '600',
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  progressInfo: {
    alignItems: 'center',
  },
  progressAmount: {
    fontSize: 14,
  },
})

