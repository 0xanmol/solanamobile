import React from 'react'
import { View, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native'
import { AppText } from '@/components/app-text'

interface OverviewSectionProps {
  name: string
  description: string
  targetDate: string
  palette: any
  inputBaseStyle: any
  isDark: boolean
  onNameChange: (name: string) => void
  onDescriptionChange: (description: string) => void
  onDatePress: () => void
}

export function OverviewSection({
  name,
  description,
  targetDate,
  palette,
  inputBaseStyle,
  isDark,
  onNameChange,
  onDescriptionChange,
  onDatePress,
}: OverviewSectionProps) {
  return (
    <View style={[styles.overviewSection, { backgroundColor: palette.surface, borderColor: palette.border }]}>
      <View style={styles.overviewHeader}>
        <AppText style={[styles.overviewSectionLabel, { color: palette.label }]}>Overview</AppText>
        <View style={[styles.overviewPill, { backgroundColor: palette.accentMuted }]}>
          <Text style={[styles.overviewPillText, { color: palette.accent }]}>Required</Text>
        </View>
      </View>

      <View style={styles.twoColumn}>
        <View style={styles.flex1}>
          <AppText style={[styles.overviewFieldLabel, { color: palette.label }]}>Pot name *</AppText>
          <TextInput
            placeholder="Family trip"
            placeholderTextColor={palette.label}
            value={name}
            onChangeText={onNameChange}
            style={[styles.overviewInput, inputBaseStyle]}
            keyboardAppearance={isDark ? 'dark' : 'light'}
          />
        </View>

        <View style={styles.flex1}>
          <AppText style={[styles.overviewFieldLabel, { color: palette.label }]}>Target date *</AppText>
          <TouchableOpacity onPress={onDatePress} activeOpacity={0.85}>
            <View pointerEvents="none">
              <TextInput
                editable={false}
                value={targetDate}
                placeholderTextColor={palette.label}
                style={[styles.overviewInput, inputBaseStyle]}
                keyboardAppearance={isDark ? 'dark' : 'light'}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <AppText style={[styles.overviewFieldLabel, { color: palette.label }]}>Description</AppText>
      <TextInput
        placeholder="Why you're saving together"
        placeholderTextColor={palette.label}
        multiline
        value={description}
        onChangeText={onDescriptionChange}
        style={[styles.overviewTextArea, inputBaseStyle]}
        keyboardAppearance={isDark ? 'dark' : 'light'}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  overviewSection: {
    borderRadius: 22,
    padding: 14,
    gap: 10,
    borderWidth: 1,
  },
  overviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  overviewSectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  overviewPill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  overviewPillText: {
    fontSize: 9,
    fontWeight: '600',
  },
  twoColumn: {
    flexDirection: 'row',
    gap: 10,
  },
  flex1: {
    flex: 1,
  },
  overviewFieldLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  overviewInput: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  overviewTextArea: {
    fontSize: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    minHeight: 70,
    textAlignVertical: 'top',
  },
})

