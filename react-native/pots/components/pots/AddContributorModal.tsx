import React from 'react'
import { View, StyleSheet, Text, TouchableOpacity, Modal, ScrollView } from 'react-native'
import { AppText } from '@/components/app-text'
import { ellipsify } from '@/utils/ellipsify'

interface AddContributorModalProps {
  visible: boolean
  friends: Array<{ id: string; address: string; displayName?: string }>
  existingContributors: string[]
  colors: any
  onClose: () => void
  onSelectFriend: (address: string) => void
}

export function AddContributorModal({
  visible,
  friends,
  existingContributors,
  colors,
  onClose,
  onSelectFriend,
}: AddContributorModalProps) {
  const availableFriends = friends.filter((f) => !existingContributors.includes(f.address))

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.cardBackground }]}>
          <AppText type="title" style={styles.modalTitle}>
            Add Contributor
          </AppText>
          <ScrollView style={styles.modalScrollView}>
            {availableFriends.length === 0 ? (
              <AppText style={[styles.emptyText, { color: colors.textSecondary }]}>
                All friends are already contributors
              </AppText>
            ) : (
              availableFriends.map((friend) => (
                <TouchableOpacity
                  key={friend.id}
                  style={[styles.friendOption, { borderColor: colors.border }]}
                  onPress={() => onSelectFriend(friend.address)}
                >
                  <View style={[styles.avatar, { backgroundColor: colors.accentPurple }]}>
                    <Text style={styles.avatarText}>
                      {friend.displayName ? friend.displayName[0].toUpperCase() : friend.address[2].toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.friendOptionInfo}>
                    {friend.displayName && (
                      <AppText style={styles.friendOptionName}>{friend.displayName}</AppText>
                    )}
                    <AppText style={[styles.friendOptionAddress, { color: colors.textSecondary }]}>
                      {ellipsify(friend.address, 12)}
                    </AppText>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
          <TouchableOpacity
            style={[styles.modalButton, { borderColor: colors.border, marginTop: 16 }]}
            onPress={onClose}
          >
            <Text style={[styles.modalButtonText, { color: colors.text }]}>Close</Text>
          </TouchableOpacity>
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
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalScrollView: {
    maxHeight: 400,
  },
  friendOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  friendOptionInfo: {
    flex: 1,
  },
  friendOptionName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  friendOptionAddress: {
    fontSize: 12,
  },
  emptyText: {
    fontSize: 13,
    textAlign: 'center',
    padding: 20,
  },
  modalButton: {
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  modalButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
})

