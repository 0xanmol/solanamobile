import { PublicKey } from '@solana/web3.js'
import { useGetBalance } from '@/components/account/use-get-balance'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import { AppText } from '@/components/app-text'
import { lamportsToSol } from '@/utils/lamports-to-sol'
import { Colors } from '@/constants/colors'
import { Fonts } from '@/constants/fonts'
import { useColorScheme } from 'react-native'

function formatBalance(balance: number): string {
  if (balance === 0) return '0.0000'
  
  // Truncate to 4 decimal places without rounding
  const multiplier = Math.pow(10, 4)
  const truncated = Math.floor(balance * multiplier) / multiplier
  
  // Convert to string and ensure exactly 4 decimal places
  const parts = truncated.toString().split('.')
  if (parts.length === 1) {
    return parts[0] + '.0000'
  }
  
  // Pad with zeros if needed to show exactly 4 decimal places
  const decimalPart = parts[1].padEnd(4, '0').substring(0, 4)
  return parts[0] + '.' + decimalPart
}

export function AccountUiBalance({ address, textColor }: { address: PublicKey; textColor?: string }) {
  const query = useGetBalance({ address })
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'
  const colors = Colors[isDark ? 'dark' : 'light']
  
  const balanceText = query.data ? formatBalance(lamportsToSol(query.data)) : '0.00'

  return (
    <View style={styles.container}>
      {query.isLoading ? (
        <ActivityIndicator size="large" color={textColor ?? colors.accentGreen} />
      ) : (
        <AppText 
          style={[styles.balance, { color: textColor ?? colors.text }]}
          numberOfLines={1}
          adjustsFontSizeToFit={true}
          minimumFontScale={0.7}
        >
          {balanceText} <AppText style={styles.currency}>SOL</AppText>
        </AppText>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    flex: 1,
    minWidth: 0,
  },
  balance: {
    fontSize: 32,
    fontFamily: 'IBMPlexSans-Bold',
    letterSpacing: -0.5,
    flexShrink: 1,
  },
  currency: {
    fontSize: 20,
    fontFamily: 'IBMPlexSans-SemiBold',
    opacity: 0.7,
  },
})
