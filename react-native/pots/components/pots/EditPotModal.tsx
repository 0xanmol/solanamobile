import React from 'react'
import { View, StyleSheet, Text, TextInput, TouchableOpacity, Modal } from 'react-native'
import { AppText } from '@/components/app-text'

interface EditPotModalProps {
  visible: boolean
  name: string
  description: string
  colors: any
  onClose: () => void
  onNameChange: (name: string) => void
  onDescriptionChange: (description: string) => void
  onSubmit: () => void
}

export function EditPotModal({
  visible,
  name,
  description,
  colors,
  onClose,
  onNameChange,
  onDescriptionChange,
  onSubmit,
}: EditPotModalProps) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.cardBackground }]}>
          <AppText type="title" style={styles.modalTitle}>
            Edit Pot
          </AppText>
          <AppText style={[styles.modalLabel, { color: colors.textSecondary }]}>Name</AppText>
          <TextInput
            style={[styles.modalInput, { color: colors.text, borderColor: colors.border }]}
            placeholder="Pot name"
            placeholderTextColor={colors.textSecondary}
            value={name}
            onChangeText={onNameChange}
          />
          <AppText style={[styles.modalLabel, { color: colors.textSecondary }]}>Description</AppText>
          <TextInput
            style={[
              styles.modalInput,
              styles.modalTextArea,
              { color: colors.text, borderColor: colors.border },
            ]}
            placeholder="Description"
            placeholderTextColor={colors.textSecondary}
            value={description}
            onChangeText={onDescriptionChange}
            multiline
            numberOfLines={3}
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
              <Text style={styles.modalButtonText}>Save</Text>
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
    justifyContent: 'flex-end',
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
    marginBottom: 16,
  },
  modalTextArea: {
    minHeight: 80,
    textAlignVertical: 'top',
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

