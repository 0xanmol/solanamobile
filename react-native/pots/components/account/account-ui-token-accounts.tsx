import { PublicKey } from '@solana/web3.js'
import { AppText } from '@/components/app-text'
import { ActivityIndicator, View, StyleSheet } from 'react-native'
import { ellipsify } from '@/utils/ellipsify'
import { AccountUiTokenBalance } from '@/components/account/account-ui-token-balance'
import { useGetTokenAccounts } from '@/components/account/use-get-token-accounts'
import { Colors } from '@/constants/colors'
import { Fonts } from '@/constants/fonts'
import { useColorScheme } from 'react-native'

export function AccountUiTokenAccounts({ address }: { address: PublicKey }) {
  const query = useGetTokenAccounts({ address })
  const items = query.data ?? []
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'
  const colors = Colors[isDark ? 'dark' : 'light']

  return (
    <View>
      {query.isLoading && <ActivityIndicator size="small" color={colors.accentGreen} style={styles.loader} />}
      {query.isError && (
        <View style={[styles.errorCard, { backgroundColor: colors.surfaceMuted, borderColor: colors.borderMuted }]}>
          <AppText style={[styles.errorTitle, { color: colors.text }]}>Unable to load tokens</AppText>
          <AppText style={[styles.errorText, { color: colors.textSecondary }]} numberOfLines={2}>
            {query.error?.message.toString()}
          </AppText>
        </View>
      )}
      {query.isSuccess &&
        (items.length === 0 ? (
            <View style={styles.emptyContainer}>
            <AppText style={[styles.emptyTitle, { color: colors.text }]}>No token accounts yet</AppText>
            <AppText style={[styles.emptyText, { color: colors.textSecondary }]}>
              Tokens you hold will appear here automatically.
            </AppText>
            </View>
          ) : (
          <View style={styles.list}>
            {items.map((item, index) => {
              const mint = item.account.data.parsed.info.mint
              const decimals = item.account.data.parsed.info.tokenAmount.decimals
              return (
                <View
                  key={item.pubkey.toString()}
                  style={[
                    styles.row,
                    { borderBottomColor: colors.borderMuted },
                    index === items.length - 1 && styles.lastRow,
                  ]}
                >
                  <View style={styles.rowLeft}>
                    <AppText style={[styles.mintLabel, { color: colors.text }]} numberOfLines={1}>
                      {ellipsify(mint, 12)}
                  </AppText>
                    <AppText style={[styles.pubkey, { color: colors.textSecondary }]} numberOfLines={1}>
                      {ellipsify(item.pubkey.toString(), 10)}
                  </AppText>
                  </View>
                  <View style={styles.rowRight}>
                    <AccountUiTokenBalance address={item.pubkey} />
                    <AppText style={[styles.decimals, { color: colors.textTertiary }]}>{decimals} decimals</AppText>
                  </View>
                </View>
              )
            })}
                </View>
              ))}
    </View>
  )
}

const styles = StyleSheet.create({
  loader: {
    marginVertical: 14,
  },
  errorCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 4,
  },
  errorTitle: {
    fontSize: 13,
    fontFamily: 'IBMPlexSans-SemiBold',
  },
  errorText: {
    fontSize: 12,
    lineHeight: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: 16,
    gap: 6,
  },
  emptyTitle: {
    fontSize: 15,
    fontFamily: 'IBMPlexSans-SemiBold',
  },
  emptyText: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  list: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  rowLeft: {
    flex: 1,
    minWidth: 0,
    paddingHorizontal: 6,
  },
  mintLabel: {
    fontSize: 14,
    fontFamily: 'IBMPlexSans-SemiBold',
    letterSpacing: -0.1,
  },
  pubkey: {
    fontSize: 12,
    fontFamily: Fonts.mono,
    marginTop: 2,
  },
  rowRight: {
    alignItems: 'flex-end',
    gap: 2,
    paddingHorizontal: 6,
  },
  decimals: {
    fontSize: 11,
  },
})
