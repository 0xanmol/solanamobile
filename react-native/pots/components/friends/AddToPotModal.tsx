import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable, ScrollView } from 'react-native'
import { AppText } from '@/components/app-text'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { ellipsify } from '@/utils/ellipsify'
import { PotCategory } from '@/store/app-store'

interface AddToPotModalProps {
  visible: boolean
  friend: any
  availablePots: any[]
  palette: any
  cardStyle: any
  onClose: () => void
  onSelectPot: (potId: string) => void
  getCategoryIcon: (category: PotCategory) => string
  getCategoryColor: (category: PotCategory) => string
  getDaysLeft: (targetDate: Date) => string
}

export function AddToPotModal({
  visible,
  friend,
  availablePots,
  palette,
  cardStyle,
  onClose,
  onSelectPot,
  getCategoryIcon,
  getCategoryColor,
  getDaysLeft,
}: AddToPotModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Pressable style={styles.modalBackdrop} onPress={onClose} />
        <View style={[styles.modalCardCompact, cardStyle, styles.potSelectionModal, { backgroundColor: palette.surface }]}>
          <AppText style={[styles.modalTitleCompact, { color: palette.text }]}>Add to Pot</AppText>
          {availablePots.length === 0 ? (
            <View style={styles.emptyPotsContainer}>
              <AppText style={[styles.emptyPotsText, { color: palette.textSecondary }]}>
                {friend.displayName || ellipsify(friend.address, 8)} is already in all your pots.
              </AppText>
            </View>
          ) : (
            <ScrollView style={styles.potListCompact} showsVerticalScrollIndicator={false}>
              {availablePots.map((pot, index) => {
                const categoryIcon = getCategoryIcon(pot.category)
                const categoryColor = getCategoryColor(pot.category)
                const daysLeft = getDaysLeft(pot.targetDate)

                return (
                  <TouchableOpacity
                    key={pot.id}
                    onPress={() => onSelectPot(pot.id)}
                    style={[
                      styles.potItemCompact,
                      { borderBottomColor: palette.border },
                      index === availablePots.length - 1 && styles.potItemLast,
                    ]}
                    activeOpacity={0.6}
                  >
                    <View style={[styles.potItemIcon, { backgroundColor: `${categoryColor}15` }]}>
                      <MaterialIcons name={categoryIcon as any} size={18} color={categoryColor} />
                    </View>
                    <View style={styles.potItemContent}>
                      <AppText style={[styles.potItemNameCompact, { color: palette.text }]} numberOfLines={1}>
                        {pot.name}
                      </AppText>
                      <View style={styles.potItemMeta}>
                        <View style={styles.potItemMetaItem}>
                          <MaterialIcons name="people" size={12} color={palette.textSecondary} />
                          <AppText style={[styles.potItemMetaText, { color: palette.textSecondary }]}>
                            {pot.contributors.length}
                          </AppText>
                        </View>
                        <View style={styles.potItemMetaItem}>
                          <MaterialIcons name="schedule" size={12} color={palette.textSecondary} />
                          <AppText style={[styles.potItemMetaText, { color: palette.textSecondary }]}>
                            {daysLeft}
                          </AppText>
                        </View>
                      </View>
                    </View>
                    <MaterialIcons name="chevron-right" size={20} color={palette.textSecondary} />
                  </TouchableOpacity>
                )
              })}
            </ScrollView>
          )}
          <TouchableOpacity
            onPress={onClose}
            style={styles.modalButtonCompact}
            activeOpacity={0.6}
          >
            <Text style={[styles.modalButtonTextCompact, { color: palette.accent }]}>Cancel</Text>
          </TouchableOpacity>
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
  modalCardCompact: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
    borderWidth: 1,
  },
  potSelectionModal: {
    maxHeight: '75%',
    paddingBottom: 8,
  },
  modalTitleCompact: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  emptyPotsContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyPotsText: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 8,
  },
  potListCompact: {
    maxHeight: 280,
    marginTop: 8,
    marginBottom: 0,
  },
  potItemCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 0,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  potItemLast: {
    borderBottomWidth: 0,
  },
  potItemIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  potItemContent: {
    flex: 1,
    gap: 4,
  },
  potItemNameCompact: {
    fontSize: 17,
    fontWeight: '400',
    letterSpacing: -0.3,
    marginBottom: 3,
  },
  potItemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  potItemMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  potItemMetaText: {
    fontSize: 13,
    fontWeight: '400',
    letterSpacing: -0.1,
  },
  modalButtonCompact: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  modalButtonTextCompact: {
    fontWeight: '600',
    fontSize: 17,
    letterSpacing: -0.2,
  },
})

