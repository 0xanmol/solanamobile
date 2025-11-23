import { AppPage } from '@/components/app-page'
import { AppText } from '@/components/app-text'
import { FloatingActionButton } from '@/components/floating-action-button'
import { useWalletUi } from '@/components/solana/use-wallet-ui'
import { useScrollContext } from '@/components/tab-bar/scroll-context'
import { CircularProgress } from '@/components/ui/circular-progress'
import { Fonts } from '@/constants/fonts'
import { useAppTheme } from '@/hooks/use-app-theme'
import { PotCategory, useAppStore } from '@/store/app-store'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import React, { useMemo, useRef, useState } from 'react'
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'

/**
 * PotsScreen — Consistent Glass/Apple Theme
 */

type FilterType = 'ALL' | 'Released' | 'FULL' | 'Date exceeded'

export default function PotsScreen() {
  const router = useRouter()
  const { palette, cardStyle, isDark } = useAppTheme()
  const { scrollY, handleScroll } = useScrollContext()
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('ALL')
  const filterButtonRef = useRef<View>(null)
  const [filterButtonLayout, setFilterButtonLayout] = useState({ x: 0, y: 0, width: 0, height: 0 })

  const { account } = useWalletUi()
  const { getUserPots, pots } = useAppStore()
  // Show all pots if user is connected, or filter by user address
  const allUserPots = account ? (getUserPots(account.address).length > 0 ? getUserPots(account.address) : pots) : []

  // helpers (preserve original logic)
  const getTotalContributed = (pot: any) => pot.contributions.reduce((s: number, c: any) => s + c.amount, 0)
  const getProgress = (pot: any) => {
    const total = getTotalContributed(pot)
    return pot.targetAmount > 0 ? Math.min((total / pot.targetAmount) * 100, 100) : 0
  }
  const isReleaseable = (pot: any) => new Date() >= new Date(pot.targetDate) && !pot.isReleased

  // Filter pots based on selected filter
  const userPots = useMemo(() => {
    if (selectedFilter === 'ALL') return allUserPots
    if (selectedFilter === 'Released') return allUserPots.filter((pot: any) => pot.isReleased)
    if (selectedFilter === 'FULL') {
      return allUserPots.filter((pot: any) => {
        const prog = getProgress(pot)
        return prog >= 100 && !pot.isReleased
      })
    }
    if (selectedFilter === 'Date exceeded') {
      return allUserPots.filter((pot: any) => {
        const dateExceeded = new Date() >= new Date(pot.targetDate)
        return dateExceeded && !pot.isReleased
      })
    }
    return allUserPots
  }, [allUserPots, selectedFilter])

  // Category helpers
  const getCategoryIcon = (category: PotCategory) => {
    switch (category) {
      case 'Goal': return 'flag'
      case 'Emergency': return 'emergency'
      case 'Bills': return 'receipt'
      case 'Events': return 'event'
      case 'Others': return 'category'
      default: return 'savings'
    }
  }

  const getCategoryColor = (category: PotCategory) => {
    switch (category) {
      case 'Goal': return '#22E1A2'
      case 'Emergency': return '#FF6B6B'
      case 'Bills': return '#4ECDC4'
      case 'Events': return '#FFD93D'
      case 'Others': return '#95A5A6'
      default: return palette.accent
    }
  }

  return (
    <AppPage>
      <LinearGradient
        colors={palette.gradient}
        locations={isDark ? [0, 0.55, 1] : [0, 0.5, 1]}
        style={styles.gradient}
      >
        <View style={styles.screen}>
        <Animated.ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false, listener: handleScroll }
          )}
        >
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <AppText style={[styles.headerTitle, { color: palette.text }]}>Pots</AppText>
              <AppText style={[styles.headerSubtitle, { color: palette.textSecondary }]}>Goals, shared & secured</AppText>
            </View>

            <View ref={filterButtonRef} collapsable={false}>
              <TouchableOpacity
                onPress={() => {
                  filterButtonRef.current?.measure((x, y, width, height, pageX, pageY) => {
                    setFilterButtonLayout({ x: pageX, y: pageY, width, height })
                    setShowFilterModal(true)
                  })
                }}
                activeOpacity={0.7}
                style={[styles.iconButton, { backgroundColor: palette.surfaceMuted }]}
              >
                <MaterialIcons name="filter-list" size={22} color={palette.text} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Empty states */}
          {!account ? (
            <View style={styles.emptyContainer}>
              <AppText style={[styles.emptyMsg, { color: palette.textSecondary }]}>Connect your wallet to see your pots</AppText>
            </View>
          ) : userPots.length === 0 ? (
            <View style={[styles.emptyCard, cardStyle, { backgroundColor: palette.surface }]}>
              <View style={[styles.emptyIcon, { backgroundColor: palette.surfaceMuted }]}>
                 <MaterialIcons name="savings" size={28} color={palette.textSecondary} />
              </View>
              <AppText style={[styles.emptyTitle, { color: palette.text }]}>No pots yet</AppText>
              <AppText style={[styles.emptySubtitle, { color: palette.textSecondary }]}>
                  Create a pot to save together. Invite contributors and track progress.
                </AppText>

                <TouchableOpacity
                activeOpacity={0.85}
                  onPress={() => router.push('/(tabs)/pots/create')}
                  style={[styles.createCta, { backgroundColor: palette.accent }]}
                >
                  <Text style={styles.createCtaText}>Create pot</Text>
                </TouchableOpacity>
            </View>
          ) : (
            /* Pots list */
            <View style={styles.list}>
              {userPots.map((pot: any) => {
                const total = getTotalContributed(pot)
                const prog = getProgress(pot)
                const releaseable = isReleaseable(pot)
                const isComplete = prog >= 100
                const canRelease = isComplete && releaseable && !pot.isReleased
                const categoryColor = getCategoryColor(pot.category)

                return (
                  <View key={pot.id} style={{ marginBottom: 12 }}>
                    <View style={[styles.potCard, cardStyle, { backgroundColor: palette.surface }]}>
                      {/* Header */}
                      <TouchableOpacity
                        activeOpacity={0.95}
                        onPress={() => router.push(`/(tabs)/pots/${pot.id}`)}
                        style={styles.potHeader}
                      >
                        <View style={styles.potLeft}>
                          <View style={[styles.potIcon, { backgroundColor: `${categoryColor}15` }]}>
                            <MaterialIcons name={getCategoryIcon(pot.category) as any} size={18} color={categoryColor} />
                          </View>
                          <View style={styles.potMeta}>
                            <AppText style={[styles.potTitle, { color: palette.text }]} numberOfLines={1}>
                              {pot.name}
                            </AppText>
                            {!!pot.description && (
                              <AppText style={[styles.potDesc, { color: palette.textSecondary }]} numberOfLines={1}>
                                {pot.description}
                              </AppText>
                            )}
                          </View>
                        </View>
                        {pot.isReleased && (
                          <View style={[styles.badge, { backgroundColor: palette.accentMuted }]}>
                            <Text style={[styles.badgeText, { color: palette.accent }]}>Released</Text>
                          </View>
                        )}
                      </TouchableOpacity>

                      {/* Progress Section */}
                      <View style={styles.progressSection}>
                        <CircularProgress
                          progress={prog}
                          size={28}
                          strokeWidth={2}
                          color={isComplete ? palette.accent : palette.textSecondary}
                          backgroundColor={palette.surfaceMuted}
                        />
                        <View style={styles.progressInfo}>
                          <View style={styles.progressAmountRow}>
                            <AppText style={[styles.progressAmount, { color: palette.text }]}>
                              {total.toFixed(2)}
                            </AppText>
                            <AppText style={[styles.progressCurrency, { color: palette.textSecondary }]}>
                              {' '}{pot.currency}
                            </AppText>
                          </View>
                          <AppText style={[styles.progressTarget, { color: palette.textSecondary }]}>
                            of {pot.targetAmount.toFixed(2)} {pot.currency}
                          </AppText>
                        </View>
                        <View style={styles.progressMeta}>
                          <View style={styles.metaItem}>
                            <MaterialIcons name="event" size={11} color={palette.textSecondary} />
                            <AppText style={[styles.metaText, { color: palette.textSecondary }]}>
                              {new Date(pot.targetDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </AppText>
                          </View>
                          <View style={styles.metaItem}>
                            <MaterialIcons name="people" size={11} color={palette.textSecondary} />
                            <AppText style={[styles.metaText, { color: palette.textSecondary }]}>
                              {pot.contributors.length}
                            </AppText>
                          </View>
                        </View>
                      </View>

                      {/* Action Buttons */}
                      <View style={styles.actionButtons}>
                        <TouchableOpacity
                          style={[
                            styles.actionButton,
                            styles.contributeButton,
                            {
                              backgroundColor: isComplete ? palette.surfaceMuted : '#0b6244',
                            },
                            isComplete && styles.actionButtonDisabled,
                          ]}
                          disabled={isComplete}
                          activeOpacity={0.7}
                          onPress={() => {
                            // TODO: Handle contribute action
                            router.push(`/(tabs)/pots/${pot.id}`)
                          }}
                        >
                          <MaterialIcons
                            name="add-circle-outline"
                            size={13}
                            color={isComplete ? palette.textSecondary : '#FFFFFF'}
                          />
                          <AppText
                            style={[
                              styles.actionButtonText,
                              { color: isComplete ? palette.textSecondary : '#FFFFFF' },
                            ]}
                          >
                            Contribute
                          </AppText>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[
                            styles.actionButton,
                            styles.releaseButton,
                            canRelease
                              ? { backgroundColor: categoryColor }
                              : { backgroundColor: palette.surfaceMuted },
                            !canRelease && styles.actionButtonDisabled,
                          ]}
                          disabled={!canRelease}
                          activeOpacity={0.7}
                          onPress={() => {
                            // TODO: Handle release action
                            router.push(`/(tabs)/pots/${pot.id}`)
                          }}
                        >
                          <MaterialIcons
                            name="check-circle-outline"
                            size={13}
                            color={canRelease ? '#041015' : palette.textSecondary}
                          />
                          <AppText
                            style={[
                              styles.actionButtonText,
                              { color: canRelease ? '#041015' : palette.textSecondary },
                            ]}
                          >
                            Release
                          </AppText>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                )
              })}
            </View>
          )}
        </Animated.ScrollView>
      </View>
      <FloatingActionButton scrollY={scrollY} />

      {/* Filter Popup */}
      <Modal
        visible={showFilterModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowFilterModal(false)}>
          <View
            style={[
              styles.filterPopup,
              {
                backgroundColor: palette.surface,
                borderColor: palette.border,
                top: filterButtonLayout.y + filterButtonLayout.height + 8,
                right: 16,
                shadowColor: isDark ? '#000' : '#000',
              },
            ]}
            onStartShouldSetResponder={() => true}
          >
            {(['ALL', 'Released', 'FULL', 'Date exceeded'] as FilterType[]).map((filter, index) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterOption,
                  index < 3 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: palette.border },
                ]}
                activeOpacity={0.6}
                onPress={() => {
                  setSelectedFilter(filter)
                  setShowFilterModal(false)
                }}
              >
                <AppText
                  style={[
                    styles.filterOptionText,
                    {
                      color: selectedFilter === filter ? palette.accent : palette.text,
                      fontWeight: selectedFilter === filter ? '600' : '400',
                    },
                  ]}
                >
                  {filter}
                </AppText>
                {selectedFilter === filter && (
                  <MaterialIcons name="check" size={16} color={palette.accent} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
      </LinearGradient>
    </AppPage>
  )
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  screen: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 120,
  },

  /* Header */
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  headerLeft: {
    flex: 1,
    gap: 2,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'IBMPlexSans-Bold',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* Empty State */
  emptyContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  emptyCard: {
    width: '100%',
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderRadius: 24,
    borderWidth: 1,
  },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'IBMPlexSans-Bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  createCta: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 999,
  },
  createCtaText: {
    color: '#041015',
    fontFamily: 'IBMPlexSans-Bold',
    fontSize: 15,
  },
  emptyMsg: { fontSize: 15 },

  /* List */
  list: {
    marginTop: 0,
  },
  potCard: {
    padding: 14,
    borderRadius: 20,
    borderWidth: 1,
  },
  potHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  potLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  potIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  potMeta: {
    flex: 1,
    minWidth: 0,
  },
  potTitle: {
    fontSize: 15,
    fontFamily: 'IBMPlexSans-Bold',
    letterSpacing: -0.3,
    marginBottom: 1,
  },
  potDesc: {
    fontSize: 11,
    letterSpacing: -0.2,
  },
  badge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 9,
    fontFamily: 'IBMPlexSans-Bold',
    letterSpacing: 0.2,
  },

  /* Progress Section */
  progressSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  progressInfo: {
    flex: 1,
  },
  progressAmountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 1,
  },
  progressAmount: {
    fontSize: 14,
    fontFamily: 'IBMPlexSans-SemiBold',
    letterSpacing: -0.3,
  },
  progressCurrency: {
    fontSize: 12,
    fontFamily: 'IBMPlexSans-Medium',
  },
  progressTarget: {
    fontSize: 11,
    fontFamily: Fonts.body,
  },
  progressMeta: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  metaText: {
    fontSize: 10,
    fontFamily: Fonts.body,
  },

  /* Action Buttons */
  actionButtons: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 0,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    gap: 4,
  },
  contributeButton: {},
  releaseButton: {},
  actionButtonDisabled: {
    opacity: 0.5,
  },
  actionButtonText: {
    fontSize: 11,
    fontFamily: 'IBMPlexSans-SemiBold',
    letterSpacing: -0.2,
  },

  /* Filter Popup */
  modalOverlay: {
    flex: 1,
  },
  filterPopup: {
    position: 'absolute',
    minWidth: 130,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
    paddingVertical: 2,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 6,
    minHeight: 32,
  },
  filterOptionText: {
    fontSize: 13,
    fontFamily: Fonts.body,
    letterSpacing: -0.2,
  },
})
