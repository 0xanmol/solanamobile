import React from 'react'
import { View, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native'
import { AppText } from '@/components/app-text'

interface GoalSectionProps {
  amount: string
  currency: 'SOL' | 'USDC'
  palette: any
  inputBaseStyle: any
  isDark: boolean
  onAmountChange: (amount: string) => void
  onCurrencyChange: (currency: 'SOL' | 'USDC') => void
}

export function GoalSection({
  amount,
  currency,
  palette,
  inputBaseStyle,
  isDark,
  onAmountChange,
  onCurrencyChange,
}: GoalSectionProps) {
  return (
    <View style={[styles.goalSection, { backgroundColor: palette.surface, borderColor: palette.border }]}>
      <AppText style={[styles.goalSectionLabel, { color: palette.label }]}>Goal *</AppText>

      <View style={styles.goalAmountRow}>
        <TextInput
          placeholder="0.00"
          placeholderTextColor={palette.label}
          value={amount}
          onChangeText={onAmountChange}
          keyboardType="decimal-pad"
          style={[styles.goalAmountInput, inputBaseStyle]}
          keyboardAppearance={isDark ? 'dark' : 'light'}
        />

        <View style={[styles.goalCurrencySelector, { backgroundColor: palette.surfaceMuted }]}>
          {(['SOL', 'USDC'] as const).map((item) => {
            const active = currency === item
            return (
              <TouchableOpacity
                key={item}
                onPress={() => onCurrencyChange(item)}
                style={[
                  styles.goalCurrencyButton,
                  active
                    ? { backgroundColor: palette.accent, borderColor: 'transparent' }
                    : { backgroundColor: 'transparent', borderColor: palette.border },
                ]}
                activeOpacity={0.9}
              >
                <Text style={[styles.goalCurrencyText, { color: active ? '#041015' : palette.text }]}>
                  {item}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  goalSection: {
    borderRadius: 22,
    padding: 14,
    gap: 10,
    borderWidth: 1,
  },
  goalSectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  goalAmountRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  goalAmountInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  goalCurrencySelector: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 2,
    gap: 4,
  },
  goalCurrencyButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
  },
  goalCurrencyText: {
    fontSize: 13,
    fontWeight: '600',
  },
})

