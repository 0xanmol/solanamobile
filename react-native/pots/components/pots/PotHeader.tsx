import React from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import { AppText } from '@/components/app-text'

interface PotHeaderProps {
  potName: string
  colors: any
  onBack: () => void
  onEdit: () => void
}

export function PotHeader({ potName, colors, onBack, onEdit }: PotHeaderProps) {
  return (
    <View style={[styles.header, { borderBottomColor: colors.border }]}>
      <TouchableOpacity onPress={onBack}>
        <Text style={[styles.backButton, { color: colors.text }]}>← Back</Text>
      </TouchableOpacity>
      <AppText type="title" style={styles.headerTitle}>
        {potName}
      </AppText>
      <TouchableOpacity onPress={onEdit}>
        <Text style={[styles.editButton, { color: colors.accentGreen }]}>Edit</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    fontSize: 15,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  editButton: {
    fontSize: 15,
    fontWeight: '600',
  },
})

