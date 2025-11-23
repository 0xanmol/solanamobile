import React from 'react'
import { View, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native'
import { AppText } from '@/components/app-text'
import { ellipsify } from '@/utils/ellipsify'

interface ContributorSelectorProps {
  friends: Array<{ id: string; address: string; displayName?: string }>
  selectedContributors: Set<string>
  palette: any
  cardStyle: any
  onToggleContributor: (address: string) => void
}

export function ContributorSelector({
  friends,
  selectedContributors,
  palette,
  cardStyle,
  onToggleContributor,
}: ContributorSelectorProps) {
  return (
    <View style={[styles.contributorsSection, cardStyle]}>
      <View style={styles.contributorsHeader}>
        <AppText style={[styles.contributorsSectionLabel, { color: palette.label }]}>Contributors *</AppText>
        <AppText style={[styles.contributorsHelper, { color: palette.textSecondary }]}>
          {selectedContributors.size || 0}/{friends.length}
        </AppText>
      </View>

      {friends.length === 0 ? (
        <View
          style={[
            styles.emptyFriends,
            { borderColor: palette.border, backgroundColor: palette.surfaceMuted },
          ]}
        >
          <AppText style={[styles.emptyFriendsText, { color: palette.textSecondary }]}>
            No friends yet. Add friends first!
          </AppText>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipScroll}
        >
          {friends.map((friend) => {
            const isSelected = selectedContributors.has(friend.address)
            return (
              <TouchableOpacity
                key={friend.id}
                style={[
                  styles.friendChip,
                  isSelected
                    ? { backgroundColor: palette.accentMuted, borderColor: 'transparent' }
                    : { backgroundColor: palette.surfaceMuted, borderColor: palette.border },
                ]}
                onPress={() => onToggleContributor(friend.address)}
                activeOpacity={0.85}
              >
                <View
                  style={[
                    styles.avatar,
                    { backgroundColor: isSelected ? '#041015' : palette.chipAvatarBg },
                  ]}
                >
                  <Text
                    style={[
                      styles.avatarText,
                      { color: isSelected ? palette.accent : palette.chipAvatarText },
                    ]}
                  >
                    {friend.displayName
                      ? friend.displayName[0].toUpperCase()
                      : friend.address[2].toUpperCase()}
                  </Text>
                </View>
                <View style={styles.friendText}>
                  {friend.displayName && (
                    <AppText style={[styles.friendName, { color: palette.text }]} numberOfLines={1}>
                      {friend.displayName}
                    </AppText>
                  )}
                  <AppText style={[styles.friendAddress, { color: palette.textSecondary }]} numberOfLines={1}>
                    {ellipsify(friend.address, 6)}
                  </AppText>
                </View>
                {isSelected && <Text style={[styles.checkmarkGlyph, { color: '#041015' }]}>✓</Text>}
              </TouchableOpacity>
            )
          })}
        </ScrollView>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  contributorsSection: {
    borderRadius: 22,
    padding: 14,
    gap: 10,
    borderWidth: 1,
  },
  contributorsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contributorsSectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  contributorsHelper: {
    fontSize: 11,
    fontWeight: '600',
  },
  emptyFriends: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  emptyFriendsText: {
    fontSize: 12,
    textAlign: 'center',
  },
  chipScroll: {
    gap: 10,
    paddingRight: 4,
  },
  friendChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
    minWidth: 140,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 13,
    fontWeight: '700',
  },
  friendText: {
    flex: 1,
    minWidth: 0,
  },
  friendName: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  friendAddress: {
    fontSize: 10,
  },
  checkmarkGlyph: {
    fontSize: 16,
    fontWeight: '700',
  },
})

