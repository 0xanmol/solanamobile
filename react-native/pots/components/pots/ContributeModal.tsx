import React from 'react'
import { View, StyleSheet, Text, TextInput, TouchableOpacity, Modal, KeyboardAvoidingView, Platform } from 'react-native'
import { AppText } from '@/components/app-text'

interface ContributeModalProps {
  visible: boolean
  amount: string
  currency: string
  potName: string
  colors: any
  onClose: () => void
  onAmountChange: (amount: string) => void
  onSubmit: () => void
}

export function ContributeModal({
  visible,
  amount,
  currency,
  potName,
  colors,
  onClose,
  onAmountChange,
  onSubmit,
}: ContributeModalProps) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={[styles.modalContent, { backgroundColor: colors.cardBackground }]}>
          <AppText type="title" style={styles.modalTitle}>
            Contribute to Pot
          </AppText>
          <AppText style={[styles.modalLabel, { color: colors.textSecondary }]}>Amount ({currency})</AppText>
          <TextInput
            style={[styles.modalInput, { color: colors.text, borderColor: colors.border }]}
            placeholder="0.00"
            placeholderTextColor={colors.textSecondary}
            value={amount}
            onChangeText={onAmountChange}
            keyboardType="decimal-pad"
            autoFocus
          />
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.modalButton, { borderColor: colors.border }]}
              onPress={onClose}
            >
              <Text style={[styles.modalButtonText, { color: colors.text }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: colors.accentGreen }]}
              onPress={onSubmit}
            >
              <Text style={styles.modalButtonText}>Contribute</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  modalButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
  },
})

