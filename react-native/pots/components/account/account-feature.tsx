import { useWalletUi } from '@/components/solana/use-wallet-ui'
import { AppText } from '@/components/app-text'
import { useScrollContext } from '@/components/tab-bar/scroll-context'
import { ellipsify } from '@/utils/ellipsify'
import { AppPage } from '@/components/app-page'
import { AccountUiBalance } from '@/components/account/account-ui-balance'
import { RefreshControl, ScrollView, StyleSheet, View, TouchableOpacity, Animated } from 'react-native'
import { useRouter } from 'expo-router'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useGetBalanceInvalidate } from '@/components/account/use-get-balance'
import { PublicKey } from '@solana/web3.js'
import { useGetTokenAccounts, useGetTokenAccountsInvalidate } from '@/components/account/use-get-token-accounts'
import { WalletUiButtonConnect } from '@/components/solana/wallet-ui-button-connect'
import { GlassCard } from '@/components/ui/glass-card'
import { Colors } from '@/constants/colors'
import { Fonts } from '@/constants/fonts'
import { useColorScheme } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Clipboard from '@react-native-clipboard/clipboard'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { useCluster } from '@/components/cluster/cluster-provider'

export function AccountFeature() {
  const { account } = useWalletUi()
  const router = useRouter()
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'
  const colors = Colors[isDark ? 'dark' : 'light']
  const { selectedCluster } = useCluster()
  const { scrollY, handleScroll } = useScrollContext()
  const [refreshing, setRefreshing] = useState(false)
  const [lastSynced, setLastSynced] = useState<Date | null>(null)
  const [copied, setCopied] = useState(false)
  const invalidateBalance = useGetBalanceInvalidate({ address: account?.publicKey as PublicKey })
  const invalidateTokenAccounts = useGetTokenAccountsInvalidate({ address: account?.publicKey as PublicKey })
  const tokenAccountsQuery = useGetTokenAccounts({ address: account?.publicKey })
  const copyTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (account) {
      setLastSynced(new Date())
    } else {
      setLastSynced(null)
    }
  }, [account])

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current)
      }
    }
  }, [])

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await Promise.all([invalidateBalance(), invalidateTokenAccounts()])
    setRefreshing(false)
    setLastSynced(new Date())
  }, [invalidateBalance, invalidateTokenAccounts])

  const formatRelative = useCallback((date: Date | null) => {
    if (!date) return 'Not synced'
    const diff = Date.now() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }, [])

  const tokenCount = tokenAccountsQuery.data?.length ?? 0

  const stats = useMemo(
    () => [
      { label: 'Network', value: selectedCluster.name },
      { label: 'Tokens', value: tokenAccountsQuery.isLoading ? '—' : tokenCount.toString() },
      { label: 'Synced', value: formatRelative(lastSynced) },
    ],
    [selectedCluster.name, tokenAccountsQuery.isLoading, tokenCount, formatRelative, lastSynced],
  )

  const handleCopyAddress = useCallback(() => {
    if (!account) return
    Clipboard.setString(account.publicKey.toString())
    setCopied(true)
    if (copyTimeoutRef.current) {
      clearTimeout(copyTimeoutRef.current)
    }
    copyTimeoutRef.current = setTimeout(() => setCopied(false), 1600)
  }, [account])


  return (
    <AppPage>
      {account ? (
        <Animated.ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => onRefresh()} />}
          showsVerticalScrollIndicator={false}
          bounces={true}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false, listener: handleScroll }
          )}
        >
          <View style={styles.hero}>
            <View style={styles.headerRow}>
              <TouchableOpacity
                style={[
                  styles.navButton,
                  { backgroundColor: isDark ? colors.surfaceMuted : '#FFFFFF' },
                ]}
                onPress={() => router.back()}
              >
                <MaterialIcons name="chevron-left" size={20} color={colors.text} />
              </TouchableOpacity>
              <AppText style={[styles.heroTitle, { color: colors.text }]}>Account</AppText>
              <TouchableOpacity
                style={[
                  styles.navButton,
                  { backgroundColor: isDark ? colors.surfaceMuted : '#FFFFFF' },
                ]}
              >
                <MaterialIcons name="account-circle" size={18} color={colors.text} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={[styles.heroCard, { backgroundColor: colors.gradientMint[0] }]}>
            <LinearGradient
              colors={colors.gradientMint}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroGradient}
            >
              <View style={styles.heroHeader}>
                <View style={styles.heroLabelBlock}>
                  <AppText style={styles.heroLabel} numberOfLines={1}>Portfolio balance</AppText>
                  <AccountUiBalance address={account.publicKey} textColor='#041015' />
                </View>
                <TouchableOpacity
                  onPress={handleCopyAddress}
                  style={styles.copyButton}
                  activeOpacity={0.7}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <MaterialIcons
                    name={copied ? 'check' : 'content-copy'}
                    size={16}
                    color='#041015'
                    style={styles.copyIcon}
                  />
                  <AppText style={styles.copyText}>{copied ? 'Copied' : 'Copy'}</AppText>
                </TouchableOpacity>
              </View>
              <View style={styles.addressPill}>
                <MaterialIcons name='key' size={16} color='#041015' />
                <AppText style={styles.addressPillText} numberOfLines={1}>{ellipsify(account.publicKey.toString(), 12)}</AppText>
              </View>
              <View style={styles.heroStatsRow}>
                {stats.map((stat) => (
                  <View key={stat.label} style={styles.heroStat}>
                    <AppText style={styles.heroStatLabel} numberOfLines={1}>{stat.label}</AppText>
                    <AppText style={styles.heroStatValue} numberOfLines={1}>{stat.value}</AppText>
                  </View>
                ))}
              </View>
            </LinearGradient>
          </View>
        </Animated.ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <GlassCard style={styles.emptyCard}>
            <View style={[styles.emptyIcon, { backgroundColor: colors.surfaceMuted }]}>
              <MaterialIcons name='wallet' size={28} color={colors.accentGreen} />
            </View>
            <AppText style={[styles.emptyTitle, { color: colors.text }]}>Connect your wallet</AppText>
            <AppText style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
              Manage balances, send SOL, and inspect token accounts with a single tap.
            </AppText>
            <View style={styles.connectButton}>
              <WalletUiButtonConnect />
            </View>
          </GlassCard>
        </View>
      )}
    </AppPage>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 100,
    gap: 16,
    flexGrow: 1,
  },
  hero: {
    gap: 14,
    marginBottom: 22,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  heroTitle: {
    fontSize: 20,
    fontFamily: 'IBMPlexSans-Bold',
    letterSpacing: -0.3,
  },
  heroCard: {
    padding: 0,
    borderRadius: 24,
    overflow: 'hidden',
    width: '100%',
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 6,
  },
  heroGradient: {
    borderRadius: 24,
    padding: 20,
    gap: 18,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 16,
    width: '100%',
  },
  heroLabelBlock: {
    flex: 1,
    minWidth: 0,
    flexShrink: 1,
  },
  heroLabel: {
    fontSize: 13,
    fontFamily: 'IBMPlexSans-SemiBold',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: 'rgba(4,16,21,0.75)',
    marginBottom: 4,
  },
  copyButton: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexShrink: 0,
  },
  copyIcon: {
    marginRight: 2,
  },
  copyText: {
    fontSize: 12,
    fontFamily: 'IBMPlexSans-SemiBold',
    color: '#041015',
  },
  addressPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.7)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    maxWidth: '100%',
  },
  addressPillText: {
    fontSize: 13,
    fontFamily: 'IBMPlexSans-SemiBold',
    letterSpacing: 0.3,
    color: '#041015',
    flexShrink: 1,
  },
  heroStatsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  heroStat: {
    flex: 1,
    minWidth: 0,
  },
  heroStatLabel: {
    fontSize: 11,
    fontFamily: 'IBMPlexSans-SemiBold',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: 'rgba(4,16,21,0.7)',
  },
  heroStatValue: {
    fontSize: 14,
    fontFamily: 'IBMPlexSans-Bold',
    marginTop: 6,
    color: '#041015',
  },
  sectionCard: {
    padding: 18,
    borderRadius: 20,
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: 'IBMPlexSans-Bold',
    letterSpacing: -0.2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 32,
  },
  emptyCard: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
    gap: 12,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'IBMPlexSans-Bold',
    letterSpacing: -0.2,
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },
  connectButton: {
    width: '100%',
  },
})
