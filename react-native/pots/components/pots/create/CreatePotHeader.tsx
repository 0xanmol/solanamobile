import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { AppText } from '@/components/app-text'

interface CreatePotHeaderProps {
  palette: any
  isValid: boolean
  onCancel: () => void
  onCreate: () => void
}

export function CreatePotHeader({ palette, isValid, onCancel, onCreate }: CreatePotHeaderProps) {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onCancel} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <AppText style={[styles.headerAction, { color: palette.textSecondary }]}>Cancel</AppText>
      </TouchableOpacity>

      <View style={styles.headerCenter}>
        <AppText style={[styles.headerTitle, { color: palette.text }]}>New pot</AppText>
        <AppText style={[styles.headerSubtitle, { color: palette.textSecondary }]}>Set goals together</AppText>
      </View>

      <TouchableOpacity
        onPress={onCreate}
        disabled={!isValid}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        style={!isValid && styles.disabledButton}
      >
        <AppText
          style={[
            styles.headerAction,
            { color: isValid ? palette.accent : palette.textSecondary },
          ]}
        >
          Create
        </AppText>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  headerAction: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  disabledButton: {
    opacity: 0.4,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  headerSubtitle: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
})

