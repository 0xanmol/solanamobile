import React from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'

interface PotActionsProps {
  isContributor: boolean
  isReleased: boolean
  isReleaseable: boolean
  isTargetReached: boolean
  progress: number
  colors: any
  onContribute: () => void
  onRelease: () => void
  onAddContributor: () => void
}

export function PotActions({
  isContributor,
  isReleased,
  isReleaseable,
  isTargetReached,
  progress,
  colors,
  onContribute,
  onRelease,
  onAddContributor,
}: PotActionsProps) {
  if (!isContributor) return null

  return (
    <View style={styles.actionsContainer}>
      {!isReleased && (
        <>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.accentGreen }]}
            onPress={onContribute}
          >
            <Text style={styles.actionButtonText}>Contribute</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.actionButton,
              {
                backgroundColor: isReleaseable ? colors.accentPurple : colors.border,
                opacity: isReleaseable ? 1 : 0.5,
              },
            ]}
            onPress={onRelease}
            disabled={!isReleaseable}
          >
            <Text style={[styles.actionButtonText, { color: isReleaseable ? '#FFFFFF' : colors.textSecondary }]}>
              {isTargetReached ? 'Release Funds' : `Release Funds (${progress.toFixed(0)}%)`}
            </Text>
          </TouchableOpacity>
        </>
      )}
      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: colors.cardBackground, borderColor: colors.border, borderWidth: 1 }]}
        onPress={onAddContributor}
      >
        <Text style={[styles.actionButtonText, { color: colors.text }]}>Add Contributor</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  actionsContainer: {
    gap: 10,
    marginBottom: 16,
  },
  actionButton: {
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#000',
    fontSize: 15,
    fontWeight: '600',
  },
})

