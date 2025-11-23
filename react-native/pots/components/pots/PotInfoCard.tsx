import React from 'react'
import { View, StyleSheet } from 'react-native'
import { AppText } from '@/components/app-text'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { PotCategory } from '@/store/app-store'
import { ellipsify } from '@/utils/ellipsify'

interface PotInfoCardProps {
  pot: {
    category: PotCategory
    targetDate: Date
    currency: string
    isReleased?: boolean
    releasedAt?: Date
    releasedBy?: string
  }
  colors: any
  getCategoryIcon: (category: PotCategory) => string
  getCategoryColor: (category: PotCategory) => string
}

export function PotInfoCard({ pot, colors, getCategoryIcon, getCategoryColor }: PotInfoCardProps) {
  return (
    <View style={[styles.infoCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
      <View style={styles.infoRow}>
        <AppText style={[styles.infoLabel, { color: colors.textSecondary }]}>Category</AppText>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <View style={[styles.categoryIconSmall, { backgroundColor: `${getCategoryColor(pot.category)}20` }]}>
            <MaterialIcons name={getCategoryIcon(pot.category) as any} size={14} color={getCategoryColor(pot.category)} />
          </View>
          <AppText style={styles.infoValue}>{pot.category}</AppText>
        </View>
      </View>
      <View style={styles.infoRow}>
        <AppText style={[styles.infoLabel, { color: colors.textSecondary }]}>Target Date</AppText>
        <AppText style={styles.infoValue}>{pot.targetDate.toLocaleDateString()}</AppText>
      </View>
      <View style={styles.infoRow}>
        <AppText style={[styles.infoLabel, { color: colors.textSecondary }]}>Currency</AppText>
        <AppText style={styles.infoValue}>{pot.currency}</AppText>
      </View>
      {pot.isReleased && (
        <View style={styles.infoRow}>
          <AppText style={[styles.infoLabel, { color: colors.textSecondary }]}>Released</AppText>
          <AppText style={styles.infoValue}>
            {pot.releasedAt?.toLocaleDateString()} by {ellipsify(pot.releasedBy || '', 8)}
          </AppText>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  infoCard: {
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 13,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  categoryIconSmall: {
    width: 24,
    height: 24,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

