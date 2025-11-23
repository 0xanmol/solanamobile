import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable } from 'react-native'
import { AppText } from '@/components/app-text'
import { ellipsify } from '@/utils/ellipsify'

interface DeleteFriendModalProps {
  visible: boolean
  friend: any
  palette: any
  onClose: () => void
  onConfirm: () => void
}

export function DeleteFriendModal({ visible, friend, palette, onClose, onConfirm }: DeleteFriendModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Pressable style={styles.modalBackdrop} onPress={onClose} />
        <View style={[styles.deleteModalCard, { backgroundColor: palette.surface }]}>
          <View style={styles.deleteModalContent}>
            <AppText style={[styles.deleteModalTitle, { color: palette.text }]}>
              Delete Friend?
            </AppText>
            <AppText style={[styles.deleteModalSubtitle, { color: palette.textSecondary }]}>
              This will remove {friend.displayName || ellipsify(friend.address, 8)} from your friends list. This action cannot be undone.
            </AppText>
          </View>
          <View style={[styles.deleteModalActions, { borderTopColor: palette.border }]}>
            <TouchableOpacity
              onPress={onClose}
              style={styles.deleteModalButton}
              activeOpacity={0.7}
            >
              <Text style={[styles.deleteModalButtonText, { color: palette.accent }]}>Cancel</Text>
            </TouchableOpacity>
            <View style={[styles.deleteModalDivider, { backgroundColor: palette.border }]} />
            <TouchableOpacity
              onPress={onConfirm}
              style={styles.deleteModalButton}
              activeOpacity={0.7}
            >
              <Text style={[styles.deleteModalButtonText, styles.deleteModalButtonTextDanger, { color: '#FF3B30' }]}>
                Delete
              </Text>
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
  deleteModalCard: {
    width: '100%',
    maxWidth: 300,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 12,
  },
  deleteModalContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  deleteModalTitle: {
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  deleteModalSubtitle: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    letterSpacing: -0.1,
    paddingHorizontal: 4,
  },
  deleteModalActions: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  deleteModalButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteModalDivider: {
    width: StyleSheet.hairlineWidth,
  },
  deleteModalButtonText: {
    fontSize: 17,
    fontWeight: '400',
    letterSpacing: -0.2,
  },
  deleteModalButtonTextDanger: {
    fontWeight: '600',
  },
})

