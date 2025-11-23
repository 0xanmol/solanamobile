import React from 'react'
import { View, StyleSheet } from 'react-native'
import { AppText } from '@/components/app-text'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'

interface EmptyStateProps {
  palette: any
  type: 'none' | 'search'
}

export function EmptyState({ palette, type }: EmptyStateProps) {
  const icon = type === 'none' ? 'people-outline' : 'search'
  const title = type === 'none' ? 'No friends yet' : 'No results'
  const text =
    type === 'none'
      ? 'Add friends by their Solana public key to start creating pots together.'
      : 'Try adjusting your search.'

  return (
    <View style={styles.emptyContainer}>
      <View style={[styles.emptyIcon, { backgroundColor: palette.surfaceMuted }]}>
        <MaterialIcons name={icon} size={32} color={palette.textSecondary} />
      </View>
      <AppText style={[styles.emptyTitle, { color: palette.text }]}>{title}</AppText>
      <AppText style={[styles.emptyText, { color: palette.textSecondary }]}>{text}</AppText>
    </View>
  )
}

const styles = StyleSheet.create({
  emptyContainer: {
    paddingVertical: 48,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
})

