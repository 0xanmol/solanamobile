import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable, TextInput } from 'react-native'
import { AppText } from '@/components/app-text'
import { Fonts } from '@/constants/fonts'

interface AddFriendModalProps {
  visible: boolean
  addressInput: string
  palette: any
  isDark: boolean
  cardStyle: any
  onClose: () => void
  onAddressChange: (text: string) => void
  onSubmit: () => void
}

export function AddFriendModal({
  visible,
  addressInput,
  palette,
  isDark,
  cardStyle,
  onClose,
  onAddressChange,
  onSubmit,
}: AddFriendModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Pressable style={styles.modalBackdrop} onPress={onClose} />
        <View style={[styles.modalCard, cardStyle]}>
          <AppText style={[styles.modalTitle, { color: palette.text }]}>Add friend</AppText>
          <AppText style={[styles.modalSubtitle, { color: palette.textSecondary }]}>
            Enter a Solana public key address.
          </AppText>

          <TextInput
            value={addressInput}
            onChangeText={onAddressChange}
            placeholder="Address (e.g. 7xKX...)"
            placeholderTextColor={palette.textSecondary}
            style={[
              styles.addressInput,
              {
                color: palette.text,
                borderColor: palette.border,
                backgroundColor: palette.surfaceMuted,
              },
            ]}
            autoCapitalize="none"
            autoCorrect={false}
            multiline
            numberOfLines={2}
            keyboardAppearance={isDark ? 'dark' : 'light'}
          />

          <View style={styles.modalActions}>
            <TouchableOpacity
              onPress={onClose}
              style={styles.modalButton}
              activeOpacity={0.7}
            >
              <Text style={[styles.modalButtonText, { color: palette.textSecondary }]}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onSubmit}
              style={[styles.modalButton, { backgroundColor: palette.accent }]}
              activeOpacity={0.7}
            >
              <Text style={[styles.modalButtonText, { color: '#041015' }]}>Add friend</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    zIndex: 1000,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalCard: {
    width: '100%',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 16,
  },
  addressInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    fontFamily: Fonts.mono,
    marginBottom: 20,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonText: {
    fontWeight: '600',
    fontSize: 15,
  },
})

